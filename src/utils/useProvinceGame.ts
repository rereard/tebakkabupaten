import { useState, useEffect, useRef } from 'react';
import { FeatureCollection, Polygon, MultiPolygon, Feature } from 'geojson';
import * as turf from "@turf/turf";
import expandBBox from './expandBbox';
import { GameMode } from './gameMode';
import useStopwatch from './useStopwatch';
import { GameHistoryItem, getGameHistory, saveGame } from './gameHistory';
import { shuffleArray } from './shuffleArray';

export function useProvinceGame(decodedProvince: string | undefined){
  const stopwatch = useStopwatch();

  // state variables
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null)
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [zoomOut, setZoomOut] = useState<boolean>(false);
  const [geojsonLoaded, setGeojsonLoaded] = useState<boolean>(false);
  const [allAreas, setAllAreas] = useState<string[]>([]);
  const [quizList, setQuizList] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(quizList[0]);
  const [answeredAreas, setAnsweredAreas] = useState<{ [key: string]: "correct" | "wrong" }>({});
  const [modalIsOpen, setIsOpen] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Casual);
  const [savedTime, setSavedTime] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [mapKey, setMapKey] = useState<number>(0);
  const [gameNav, setGameNav] = useState<number>(0);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);

  // Refs for callbacks inside Leaflet
  const currentQuestionRef = useRef(currentQuestion);
  const quizListRef = useRef(quizList);
  const answeredAreasRef = useRef(answeredAreas);
  const boundsRef = useRef(bounds);
  const isPlayingRef = useRef(isPlaying);
  const gameModeRef = useRef(gameMode);

  useEffect(() => { currentQuestionRef.current = currentQuestion; }, [currentQuestion]);
  useEffect(() => { quizListRef.current = quizList; }, [quizList]);
  useEffect(() => { answeredAreasRef.current = answeredAreas; }, [answeredAreas]);
  useEffect(() => { boundsRef.current = bounds; }, [bounds]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);

  // functions
  const fetchHistory = async () => {
    if (!decodedProvince) return;
    const history = await getGameHistory(decodedProvince);
    setGameHistory(history);
  };

  const fetchMapData = () => {
    if (!decodedProvince) return;
    setGeojsonData(null);
    setGeojsonLoaded(false);
    fetch(`/geojson/${decodedProvince}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${decodedProvince} data`);
        return res.json();
      })
      .then((data: FeatureCollection<Polygon | MultiPolygon>) => {
        setGeojsonData(data);
        fetchHistory();
        // Calculate bounds
        const mergedFeatureCollection = turf.combine(data);
        const mergedFeature = mergedFeatureCollection.features[0] as Feature<Polygon | MultiPolygon>;
        if (mergedFeature) {
          const bbox = turf.bbox(mergedFeature);
          const expandedBBox = expandBBox(bbox, 0.5);
          setBounds([
            [expandedBBox[1], expandedBBox[0]],
            [expandedBBox[3], expandedBBox[2]],
          ]);
        }
        setGeojsonLoaded(true);
        setIsError(false);
        // Extract areas
        const areaNames = data.features.map((feature: any) => feature.properties.name || "Unknown");
        setAllAreas(areaNames);
      })
      .catch((err) => {
        console.error("Failed to load GeoJSON:", err);
        setIsError(true);
      });
  };

  // Initial Data Load
  useEffect(() => {
    fetchMapData();
  }, [decodedProvince]);

  // Handle Game Over Check
  useEffect(() => {
    if(geojsonLoaded && quizList.length === 0){
      setIsOpen(true);
      setIsPlaying(false);
      if(gameMode === GameMode.TimeTrial || gameMode === GameMode.Mix){
        stopwatch.stop();
        setSavedTime(stopwatch.formattedTime);
      }
      if(Object.keys(answeredAreas).length > 0) { // Don't save empty game
          saveGame(decodedProvince!, gameMode, answeredAreas, stopwatch.time).then(() => fetchHistory());
      }
      setGameNav(0);
    }
  }, [quizList]);

  const handleAreaClick = (clickedName: string) => {
    if (answeredAreasRef.current[clickedName]) return;
    if (!isPlayingRef.current) return;
    if (clickedName === currentQuestionRef.current) {
      // Correct Answer
      const filtered = quizListRef.current.filter((name) => name !== currentQuestionRef.current);
      setAnsweredAreas((prev) => ({ ...prev, [clickedName]: "correct" }));
      setQuizList(filtered);
      setCurrentQuestion(filtered[0] || null);
    } else {
      // Wrong Answer Logic based on Mode
      const correctAnswer = currentQuestionRef.current!;
      const filtered13 = quizListRef.current.filter((name) => name !== clickedName && name !== currentQuestionRef.current);
      const filtered24 = quizListRef.current.filter((name) => name !== currentQuestionRef.current);
      const unsanswered = filtered24.reduce((names, key) => {
        names[key] = 'unanswered';
        return names;
      }, {} as Record<string, any>);
      switch (gameModeRef.current) {
        case GameMode.Casual:
          setAnsweredAreas((prev) => ({ ...prev, [clickedName]: "wrong", [correctAnswer]: "wrong", }));
          setQuizList(filtered13);
          setCurrentQuestion(filtered13[0] || null);
          break;
        case GameMode.SuddenDeath:
          setAnsweredAreas((prev) => ({ ...prev, [correctAnswer]: "wrong", ...unsanswered }));
          setQuizList([]);
          setCurrentQuestion(null);
          break;
        case GameMode.TimeTrial:
          setAnsweredAreas((prev) => ({ ...prev, [clickedName]: "wrong", [correctAnswer]: "wrong", }));
          setQuizList(filtered13);
          setCurrentQuestion(filtered13[0] || null);
          stopwatch.addTime(10);
          break;
        case GameMode.Mix:
          setAnsweredAreas((prev) => ({ ...prev, [correctAnswer]: "wrong", ...unsanswered }));
          setQuizList([]);
          setCurrentQuestion(null);
          break;
      }
    }
  };

  const resetGame = () => {
    const shuffleAreaList = shuffleArray([...allAreas]);
    setQuizList(shuffleAreaList);
    setCurrentQuestion(shuffleAreaList[0]);
    setAnsweredAreas({});
  };

  const startGame = () => {
    resetGame();
    setSavedTime(null);
    setIsOpen(false);
    setIsPlaying(true);
    if (gameMode === GameMode.TimeTrial || gameMode === GameMode.Mix) {
      stopwatch.reset();
      stopwatch.start();
    }
    setMapKey((prevKey) => prevKey + 1);
  };

  const backToMap = () => {
    setZoomOut(true);
    setIsOpen(false);
    resetGame();
  };

  return {
    state: {
      geojsonData, setGeojsonData,
      bounds, setBounds,
      zoomOut, setZoomOut,
      geojsonLoaded, setGeojsonLoaded,
      allAreas, setAllAreas,
      quizList, setQuizList,
      currentQuestion, setCurrentQuestion,
      answeredAreas, setAnsweredAreas,
      modalIsOpen, setIsOpen,
      isPlaying, setIsPlaying,
      gameMode, setGameMode,
      savedTime, setSavedTime,
      isError, setIsError,
      mapKey, setMapKey,
      gameNav, setGameNav,
      gameHistory, setGameHistory,
    },
    refs: { answeredAreasRef },
    actions: { handleAreaClick, startGame, backToMap, fetchMapData },
    stopwatch
  };
}