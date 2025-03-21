import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { motion } from "motion/react"
import { useLocation, useNavigate, useParams } from 'react-router';
import Button from '../../component/Button';
import Spinner from '../../component/Spinner';
import CheckLabel from '../../component/CheckLabel';
import useStopwatch from '../../utils/useStopwatch';
import expandBBox from '../../utils/expandBbox';
import FitMapBounds from './FitMapBounds';
import MapZoomHandler from './MapZoomHandler';
import { GameHistoryItem, getGameHistory, saveGame } from '../../utils/gameHistory';
import ModalContainer from '../../component/ModalContainer';
import NavComponent from '../../component/NavComponent';
import AreaList from '../../component/AreaList';
import { GameHistoryComponent } from '../../component/GameHistoryComponent';

enum GameMode {
  Casual = 1,
  SuddenDeath = 2,
  TimeTrial = 3,
  Mix = 4,
}

/** shuffling array */
const shuffleArray = (array: string[]) => array.sort(() => Math.random() - 0.5);

export default function Province(){

  const navigate = useNavigate()
  const location = useLocation()
  const indonesiaBounds = location.state?.bounds || [[-11, 94], [6, 141]];
  const { provinceName } = useParams<{ provinceName: string }>();
  const decodedProvince = provinceName?.replace(/_/g, " ");
  const stopwatch = useStopwatch()
  const gameHistory: GameHistoryItem[] = getGameHistory(decodedProvince!)

  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null);
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null)
  const [zoomOut, setZoomOut] = useState<boolean>(false);
  const [geojsonLoaded, setGeojsonLoaded] = useState<boolean>(false);
  const [allAreas, setAllAreas] = useState<string[]>([])
  const [quizList, setQuizList] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(quizList[0]); // First question
  const [answeredAreas, setAnsweredAreas] = useState<{ [key: string]: "correct" | "wrong" }>({});
  const [modalIsOpen, setIsOpen] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Casual)
  const [savedTime, setSavedTime] = useState<string | null>(null)
  const [isError, setIsError] = useState<boolean>(false)
  const [mapKey, setMapKey] = useState<number>(0)
  const [gameNav, setGameNav] = useState<number>(0)

  const fetchData = () => {
    setGeojsonData(null); // Reset while loading new data
    setGeojsonLoaded(false)

    fetch(`/data/${decodedProvince}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${decodedProvince}.json`);
        return res.json();
      })
      .then((data) => {
        setGeojsonData(data)

        // merge geojson feature to calculate bounds
        const mergedFeatureCollection = turf.combine(data as FeatureCollection<Polygon | MultiPolygon>)
        const mergedFeature = mergedFeatureCollection.features[0] as Feature<Polygon | MultiPolygon>;
        if (!mergedFeature) {
          console.error("Failed to merge features.");
          return <p>Error loading map</p>;
        }
        const bbox = turf.bbox(mergedFeature); // [minX, minY, maxX, maxY]
        const expandedBBox = expandBBox(bbox, 0.5);
        setBounds([
          [expandedBBox[1], expandedBBox[0]], // Southwest corner (lat, lon)
          [expandedBBox[3], expandedBBox[2]], // Northeast corner (lat, lon)
        ])

        setGeojsonLoaded(true)
        setIsError(false)

        // setting quiz list
        const areaNames =data.features.map((feature: any) => feature.properties.name || "Unknown")
        setAllAreas(areaNames)
      })
      .catch((err) => {
        console.error("Failed to load GeoJSON:", err)
        setIsError(true)
      });
  }

  // setting geojson data and map bounds
  useEffect(() => {
    if (!decodedProvince) return;
    fetchData()
  }, []);

  // used for state inside MapContainer
  const currentQuestionRef = useRef(currentQuestion);
  const quizListRef = useRef(quizList);
  const answeredAreasRef = useRef(answeredAreas);
  const boundsRef = useRef(bounds);
  const isPlayingRef = useRef(isPlaying);
  const gameModeRef = useRef(gameMode)

  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  useEffect(() => {
    quizListRef.current = quizList;
  }, [quizList]);

  useEffect(() => {
    boundsRef.current = bounds;
  }, [bounds]);

  useEffect(() => {
    answeredAreasRef.current = answeredAreas;
  }, [answeredAreas]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    gameModeRef.current = gameMode;
  }, [gameMode]);

  // handle when game over
  useEffect(() => {
    if(geojsonLoaded && quizList.length === 0){
      setIsOpen(true)
      setIsPlaying(false)
      if(gameMode === GameMode.TimeTrial || gameMode === GameMode.Mix){
        stopwatch.stop()
        setSavedTime(stopwatch.formattedTime)
      }
      saveGame(decodedProvince!, gameMode, answeredAreas, stopwatch.time)
      setGameNav(0)
    }
  }, [quizList]);

  /** setting style for each area, hover style, and fill area if wrong or correct */
  const getFeatureStyle = (feature: any) => {
    const name = feature.properties.name;
    if (answeredAreas[name] === "correct") {
      return { fillColor: "green", fillOpacity: 0.6, color: "black", weight: 1 };
    } else if (answeredAreas[name] === "wrong") {
      return { fillColor: "red", fillOpacity: 0.6, color: "black", weight: 1 };
    }
    return { fillColor: "transparent", fillOpacity: 0, color: "red", weight: 1 };
  };

  // prevent map rerendering when stopwatch started
  const MemoizedMap = useMemo(() => (
    <MapContainer
      zoomControl={true} 
      dragging={true} 
      scrollWheelZoom={true}
      doubleClickZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'
        subdomains='abcd'
      />
      {geojsonData && (
        <GeoJSON
          key={mapKey}
          data={geojsonData}
          style={getFeatureStyle}
          onEachFeature={(feature, layer) => {
            const clickedName = feature.properties.name;            
            layer.on({
              mouseover: (e) => {
                if(!answeredAreasRef.current[clickedName]){
                  e.target.setStyle({ fillColor: "red", fillOpacity: 0.3 })
                } else{
                  layer.bindTooltip(clickedName, {
                    direction: "center",
                  }).openTooltip();
                }
              },
              mouseout: (e) => {
                if(!answeredAreasRef.current[clickedName]){
                  e.target.setStyle(getFeatureStyle(feature))
                }
                layer.unbindTooltip();
              },
              click: () => {
                if (answeredAreasRef.current[clickedName]) return;
                if(isPlayingRef.current){
                  if (clickedName === currentQuestionRef.current) {
                    const filtered = quizListRef.current.filter((name) => name !== currentQuestionRef.current)
                    setAnsweredAreas((prev) => ({ ...prev, [clickedName]: "correct" })); 
                    setQuizList(filtered);
                    setCurrentQuestion(filtered[0] || null); 
                  } else {
                    const correctAnswer = currentQuestionRef.current!;
                    const filtered13 = quizListRef.current.filter((name) => name !== clickedName && name !== currentQuestionRef.current)
                    const filtered24 = quizListRef.current.filter((name) => name !== currentQuestionRef.current)
                    const unsanswered = filtered24.reduce((names, key) => {
                      names[key] = 'unanswered'
                      return names
                    }, {} as Record<string, any>)
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
                        stopwatch.addTime(10)
                        break;
                      case GameMode.Mix:
                        setAnsweredAreas((prev) => ({ ...prev, [correctAnswer]: "wrong", ...unsanswered }));
                        setQuizList([]);
                        setCurrentQuestion(null);
                        break;
                    }
                  }
                }
              }   
            })
          }}
        />
      )}
      {bounds && <FitMapBounds bounds={bounds} />}
      <MapZoomHandler zoomOut={zoomOut} bounds={indonesiaBounds} onZoomComplete={() => navigate("/", { state: { scrollable: false } })} />
    </MapContainer>
  ), [answeredAreas, geojsonData]);

  return(
    <div className='w-full h-screen relative flex items-center justify-center'>
      <title>{`${decodedProvince} - Tebak Kabupaten & Kota Indonesia`}</title>
      {MemoizedMap}
      {(geojsonLoaded && !zoomOut) && (
        <>
          <h2 className='absolute z-[400] text-2xl font-bold top-10 right-0 left-0'>{currentQuestion ? `${Object.values(answeredAreas).length}/${allAreas.length}`: null}</h2>
          <h2 className='absolute z-[9999] text-2xl font-bold bottom-10 right-0 left-0'>{currentQuestion ? currentQuestion+"?" : null}</h2>
          {((gameMode === GameMode.TimeTrial || gameMode === GameMode.Mix) && isPlaying) && <h2 className='absolute z-[400] text-2xl font-bold top-20 right-0 left-0'>{stopwatch.formattedTime}</h2>}
        </>
      )}
      {(!modalIsOpen && !isPlaying && !zoomOut) && (
        <Button 
          title='Kembali'
          className='bottom-20'
          zIndex={400}
          position='absolute'
          onClick={() => {
            setIsOpen(true)
          }}
        />
      )}

      {/* Modal Component */}
      <ModalContainer
        isOpen={modalIsOpen}
        leftButtonTitle='Kembali'
        leftButtonFunction={() => {
          setZoomOut(true)
          setIsOpen(false)
          const shuffleAreaList = shuffleArray([...allAreas])
          setQuizList(shuffleAreaList)
          setCurrentQuestion(shuffleAreaList[0])
          setAnsweredAreas({})
        }}
        rightButtonTitle={Object.keys(answeredAreas).length === 0 ? 'Main' : 'Ulang'}
        rightButtonDisabled={!geojsonLoaded}
        rightButtonFunction={() => {
          const shuffleAreaList = shuffleArray([...allAreas])
          setQuizList(shuffleAreaList)
          setCurrentQuestion(shuffleAreaList[0] || null)
          if(Object.keys(answeredAreas).length !== 0){
            setAnsweredAreas({})
            setSavedTime(null)
          }
          setIsOpen(false)
          setIsPlaying(true)
          if(gameMode === GameMode.TimeTrial || gameMode === GameMode.Mix){
            stopwatch.reset()
            stopwatch.start()
          }
          setMapKey((prevKey) => prevKey + 1);
        }}
      >
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2">{Object.values(answeredAreas).length === 0 ? `Provinsi ${decodedProvince}` : 'Permainan selesai!'}</h2>
        <motion.button disabled={!geojsonLoaded} whileHover={ geojsonLoaded ? { scale: 1.07 } : {}} className='absolute top-2 right-2 text-xs md:text-sm border rounded-2xl px-2 font-bold cursor-pointer text-[#ff0000] disabled:text-[#ff7979] disabled:cursor-auto' onClick={() => setIsOpen(false)}>lihat peta</motion.button>
        {(!geojsonLoaded && !isError) ? (
          <Spinner />
        ) : 
        !isError ? (
          <>
            <NavComponent 
              setNavIndex={setGameNav}
              navIndex={gameNav}
              navList={['Permainan', 'Riwayat']}
            />
            {gameNav === 1 && (
              gameHistory.length === 0 ? (
                <div className='my-7'>
                  <p className=' italic'>Belum ada riwayat bermain di provinsi ini...</p>
                </div>
              ) : (
                <>
                  <GameHistoryComponent 
                    data={gameHistory}
                    className='max-h-56 overflow-y-auto'
                  />
                  <p className='text-gray-400 my-2 italic'>Hanya 5 permainan terakhir yang disimpan...</p>
                </>
              )
            )}
            {gameNav === 0 && (
              <>
                {Object.values(answeredAreas).length === 0 ? (
                  <p className="text-base md:text-lg mt-2">{allAreas.length} Kabupaten dan Kota</p>
                ) : (
                  <>
                    <p className='text-base md:text-lg mt-2'>Hasil: {Object.values(answeredAreas).filter(v => v === "correct").length}/{allAreas.length}{savedTime && ` | Waktu ${savedTime}`}</p>
                  </>
                )}
                <div className='my-4 h-fit w-full max-h-56 overflow-y-auto'>
                  <AreaList 
                    allAreas={allAreas}
                    answeredAreas={answeredAreas}
                  />
                </div>
                <div className='p-2 mb-4 flex flex-col w-full gap-1'>
                  <div className='flex items-center text-sm md:text-base'>
                    <span className='flex-1 md:flex-0'>Mode:</span>
                    <div className='flex-1 flex flex-col sm:flex-row justify-around'>
                      <CheckLabel 
                        checked={gameMode === GameMode.Casual ? true : false}
                        onChange={() => setGameMode(GameMode.Casual)}
                        title='Kasual'
                      />
                      <CheckLabel 
                        checked={(gameMode === GameMode.SuddenDeath || gameMode === GameMode.Mix) ? true : false}
                        onChange={() => {
                          if(gameMode === GameMode.TimeTrial){
                            setGameMode(GameMode.Mix)
                          } else if(gameMode === GameMode.Mix){
                            setGameMode(GameMode.TimeTrial)
                          } else{
                            setGameMode(GameMode.SuddenDeath)
                          }
                        }}
                        title='Sudden-Death'
                      />
                      <CheckLabel 
                        checked={(gameMode === GameMode.TimeTrial || gameMode === GameMode.Mix) ? true : false}
                        onChange={() => {
                          if(gameMode === GameMode.SuddenDeath){
                            setGameMode(GameMode.Mix)
                          } else if(gameMode === GameMode.Mix){
                            setGameMode(GameMode.SuddenDeath)
                          } else{
                            setGameMode(GameMode.TimeTrial)
                          }
                        }}
                        title='Time Trial'
                      />
                    </div>
                  </div>
                  <div className='w-full max-w-96 self-center font-bold italic text-xs md:text-sm'>
                    <p>{gameMode === GameMode.Casual ? 'Tebak tanpa batasan waktu atau penalti. Cocok untuk belajar sambil santai!' : gameMode === GameMode.SuddenDeath ? 'Satu kesalahan, game over! Uji ketepatan tanpa ruang untuk salah.' : gameMode === GameMode.TimeTrial  ? 'Selesaikan secepat mungkin! Jika salah waktu bertambah 10 detik!' : 'Ultimate Challenge! Cepat dan tepat, atau game over!'}</p>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className='my-7 flex flex-col gap-2'>
            <p>Gagal memuat...</p>
            <Button 
              title='Coba Lagi'
              onClick={() => {
                fetchData()
              }}
            />
          </div>
        )}
      </ModalContainer>
    </div>
  )
}