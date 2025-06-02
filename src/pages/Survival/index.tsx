import { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet"
import { indonesiaGeoJson } from "../../utils/indonesiaJSONdata";
import * as turf from "@turf/turf";
import expandBBox from "../../utils/expandBbox";
import ModalContainer from "../../component/ModalContainer";
import { useNavigate } from "react-router";
import { shuffleArray } from "../../utils/shuffleArray";
import useStopwatch from "../../utils/useStopwatch";
import AreaList from "../../component/AreaList";
import { GameHistoryComponent } from "../../component/GameHistoryComponent";

export default function Survival(){

  const navigate = useNavigate()
  const stopwatch = useStopwatch()
  const allProvinces = indonesiaGeoJson.features.map((feature) => feature?.properties?.name || "Unknown")

  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null)
  const [zooming, setZooming] = useState<boolean>(false)
  const [modalIsOpen, setIsOpen] = useState<boolean>(true);
  const [shuffledProvinces, setShuffledProvinces] = useState<string[]>([])
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null);
  const [provinceAreas, setProvinceAreas] = useState<string[]>([])
  const [answeredProvinceAreas, setAnsweredProvinceAreas] = useState<{ [key: string]: "correct" | "wrong" }>({});
  const [answeredProvinces, setAnsweredProvince]= useState<{ [key: string]: { 'time': number, 'answeredAreas': {[key: string]: "correct" | "wrong" } } } | null>(null)
  const [quizList, setQuizList] = useState<string[] | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [isStarting, setStarting] = useState<boolean>(false)
  const [isPlaying, setPlaying] = useState<boolean>(false)
  const [savedTime, setSavedTime] = useState<number | null>(null)
  const [isGameOver, setGameOver] = useState<boolean>(false)
  const [isGameClear, setGameClear] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // used for state inside MapContainer
  const answeredProvinceAreasRef = useRef(answeredProvinceAreas);
  useEffect(() => {
    answeredProvinceAreasRef.current = answeredProvinceAreas;
  }, [answeredProvinceAreas]);

  const isPlayingRef = useRef(isPlaying)
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const currentQuestionRef = useRef(currentQuestion);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);
  
  const quizListRef = useRef(quizList);
  useEffect(() => {
    quizListRef.current = quizList;
  }, [quizList]);
  
  const stopwatchRef = useRef(stopwatch);
  useEffect(() => {
    stopwatchRef.current = stopwatch;
  }, [stopwatch]);

  // Called when first render
  useEffect(() => {
    handleChangeBound(indonesiaGeoJson as FeatureCollection<Polygon | MultiPolygon>)
  }, []);

  // handle zooming animation
  useEffect(() => {
    if(zooming){
      setIsOpen(false)
    } else{
      setIsOpen(true)
    }
  }, [zooming]);

  // handle all areas correctly answered
  useEffect(() => {
    if(quizList?.length === 0){
      setPlaying(false)
      stopwatch.stop()
      setSavedTime(stopwatch.time)
      setAnsweredProvince((prev) => ({
        [shuffledProvinces[0]]: {
          time: stopwatch.time,
          answeredAreas: answeredProvinceAreas
        },
        ...prev
      }))
      setIsOpen(true)
    }
  }, [quizList]);


  const handleFetchSetData = (provinceName: string) => {
    setLoading(true)
    fetch(`https://tebakkabupaten-backend-production.up.railway.app/api/province/${provinceName}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${provinceName}.json`);
        return res.json();
      })
      .then((data) => {
        setGeojsonData(data)
        handleChangeBound(data)
        const areaList: string[] = data.features.map((feature: any) => feature.properties.name || "Unknown")
        const shuffleAreaList: string[] = shuffleArray(areaList)
        setProvinceAreas(areaList)
        setLoading(false)
        setZooming(true)
        setQuizList(shuffleAreaList)
        setCurrentQuestion(shuffleAreaList[0])
        setStarting(true)
      })
  }

  const handleChangeBound = (data: FeatureCollection<Polygon | MultiPolygon>) => {
    const mergedFeatureCollection = turf.combine(data)
    const mergedFeature = mergedFeatureCollection.features[0] as Feature<Polygon | MultiPolygon>;
    if (!mergedFeature) {
      console.error("Failed to merge features.");
    }
    const bbox = turf.bbox(mergedFeature); // [minX, minY, maxX, maxY]
    const expandedBBox = expandBBox(bbox, 0.5);
    setBounds([
      [expandedBBox[1], expandedBBox[0]], // Southwest corner (lat, lon)
      [expandedBBox[3], expandedBBox[2]], // Northeast corner (lat, lon)
    ])
  }

  const handleClickArea = (clickedArea: string) => {
    if (answeredProvinceAreasRef.current[clickedArea]) return;
    if(isPlayingRef.current){
      if(clickedArea === currentQuestionRef.current) {
        const filtered = quizListRef?.current?.filter((name) => name !== currentQuestionRef.current)
        setAnsweredProvinceAreas((prev) => ({ ...prev, [clickedArea]: "correct" }));
        setQuizList(filtered!);
        setCurrentQuestion(filtered![0] || null); 
      } else{
        const correctAnswer = currentQuestionRef.current!;
        const filtered = quizListRef?.current?.filter((name) => name !== currentQuestionRef.current)
        const unsanswered = filtered!.reduce((names, key) => {
          names[key] = 'unanswered'
          return names
        }, {} as Record<string, any>)
        setAnsweredProvinceAreas((prev) => ({ ...prev, [correctAnswer]: "wrong", ...unsanswered }));
        setPlaying(false)
        // setStarting(false)
        setQuizList(null)
        setCurrentQuestion(null)
        setIsOpen(true)
        stopwatchRef.current.stop()
        setAnsweredProvince((prev) => ({
          [shuffledProvinces[0]]: {
            time: stopwatchRef.current.time,
            answeredAreas: {
              ...answeredProvinceAreasRef.current, 
              [correctAnswer]: "wrong", 
              ...unsanswered}
          },
          ...prev
        }))
        setSavedTime(stopwatchRef.current.time)
        setGameOver(true)
      }
    }
  }

  /** setting style for each area, hover style, and fill area if wrong or correct */
  const getFeatureStyle = (feature: any) => {
    const name = feature.properties.name;
    if (answeredProvinceAreas[name] === "correct") {
      return { fillColor: "green", fillOpacity: 0.6, color: "black", weight: 1 };
    } else if (answeredProvinceAreas[name] === "wrong") {
      return { fillColor: "red", fillOpacity: 0.6, color: "black", weight: 1 };
    }
    return { fillColor: "transparent", fillOpacity: 0, color: "red", weight: 1 };
  };

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
          data={geojsonData}
          style={getFeatureStyle}
          onEachFeature={(feature, layer) => {
            const clickedName = feature.properties.name
            layer.on({
              mouseover: (e) => {
                if(!answeredProvinceAreasRef.current[clickedName]){
                  e.target.setStyle({ fillColor: "red", fillOpacity: 0.3 })
                } else{
                  layer.bindTooltip(clickedName, {
                    direction: "center",
                  }).openTooltip();
                }
              },
              mouseout: (e) => {
                if(!answeredProvinceAreasRef.current[clickedName]){
                  e.target.setStyle(getFeatureStyle(feature))
                }
                layer.unbindTooltip();
              },
              click: () => {
                handleClickArea(clickedName)
              }
            })
          }}
        />
      )}
      {bounds && <FitMapBounds bounds={bounds} onZoomComplete={() => {setZooming(false)}} zooming={zooming} />}
    </MapContainer>
  ), [bounds, geojsonData, answeredProvinceAreas])

  return(
    <div className='w-full h-screen relative flex items-center justify-center'>
      {MemoizedMap}
      {isPlaying && (
        <>
          <h2 className='absolute z-[400] text-2xl font-bold top-10 right-0 left-0'>{currentQuestion ? `${Object.values(answeredProvinceAreas).length}/${provinceAreas.length}`: null}</h2>
          <h2 className='absolute z-[9999] text-2xl font-bold bottom-10 right-0 left-0'>{currentQuestion ? currentQuestion+"?" : null}</h2>
          <h2 className='absolute z-[400] text-2xl font-bold top-20 right-0 left-0'>{stopwatch.formattedTime}</h2>
        </>
      )}
      <ModalContainer
        isOpen={modalIsOpen}
        leftButtonTitle="Kembali"
        leftButtonFunction={() => {
          navigate('/', { state: { scrollable: false } })
        }}
        rightButtonTitle={(isGameOver || isGameClear) ? 'Ulang' : quizList?.length === 0 ? 'Lanjut' : 'Mulai'}
        rightButtonFunction={() => {
          if(quizList){
            if(quizList.length === 0){
              if(shuffledProvinces.length > 1){
                setAnsweredProvinceAreas({})
                setGeojsonData(null)
                setBounds(null)
                const filteredShuffleProvince = shuffledProvinces.slice(1)
                setShuffledProvinces(filteredShuffleProvince)
                handleFetchSetData(filteredShuffleProvince[0])
              } else{
                setGameClear(true)
                setQuizList(null)
              }
            } else{
              setIsOpen(false)
              setPlaying(true)
              stopwatch.start()
            }
          } else{
            if(isGameOver || isGameClear){
              navigate(0)
            } else {
              const shuffleProvince: string[] = shuffleArray(allProvinces)
              setShuffledProvinces(shuffleProvince)
              handleFetchSetData(shuffleProvince[0])
            }
          }
        }}
        rbLoading={loading}
      >
        {isStarting ? (
          !isGameOver ? (
            isGameClear ? (
              <>
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2">Selamat! Permainan Selesai</h2>
                <p className='text-base md:text-lg mt-2'>{Object.keys(answeredProvinces!).length}/{allProvinces.length} Provinsi | Waktu: {stopwatch.timeFormatting(savedTime!)}</p>
                <GameHistoryComponent 
                  survivalData={answeredProvinces!}
                  className="max-h-56 overflow-y-auto"
                />
              </>
            ) : (
              <>
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2">{(allProvinces.length+1) - shuffledProvinces.length}. Provinsi {shuffledProvinces[0]}</h2>
                {quizList?.length === 0 ? (
                  <p className='text-base md:text-lg mt-2'>{(allProvinces.length+1) - shuffledProvinces.length}/{allProvinces.length} Provinsi | Waktu: {stopwatch.timeFormatting(savedTime!)}</p>
                ) : (
                  <p className="text-base md:text-lg mt-2">{provinceAreas.length} Kabupaten dan Kota</p>
                )}
                <div className='my-4 h-fit w-full max-h-56 overflow-y-auto'>
                  <AreaList
                    allAreas={provinceAreas}
                    answeredAreas={answeredProvinceAreas}
                  />
                </div>
              </>
            )
          ) : (
            <>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2">Permainan Berakhir</h2>
              <p className='text-base md:text-lg mt-2'>{Object.keys(answeredProvinces!).length}/{allProvinces.length} Provinsi | Total Waktu: {stopwatch.timeFormatting(savedTime!)}</p>
              <GameHistoryComponent 
                survivalData={answeredProvinces!}
                className="max-h-56 overflow-y-auto"
              />
            </>
          )
        ) : (
          <div className="mb-2 flex flex-col items-start text-sm md:text-base">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 self-center">Survival Mode</h2>
            <p className="text-justify">Selamat datang di Survival Mode! Tebak seluruh kabupaten & kota di 38 provinsi dengan cepat dan tepat!</p>
            <ul className='list-disc list-inside text-left'>
              <li>Luangkan waktu 10 - 15 menit untuk memainkan mode ini</li>
              <li>1 kali kesalahan = game over</li>
              <li>Tidak ada kesempatan kedua, game over = mengulang dari awal</li>
            </ul>
          </div>
        )}
      </ModalContainer>
    </div>
  )
}

/** map bounds, min and max zoom setting */
const FitMapBounds: React.FC<{ bounds: [[number, number], [number, number]]; onZoomComplete: () => void; zooming: boolean }> = ({ bounds, onZoomComplete, zooming }) => {
  const map = useMap();
  useEffect(() => {
    if (zooming) {
      map.flyToBounds(bounds, { duration: 0.5 });
      setTimeout(() => {
        map.fitBounds(bounds, { padding: [50, 50] }); // Adjust padding for a better fit
        map.setMaxZoom(14);
        const newMinZoom = map.getBoundsZoom(bounds);
        map.setMinZoom(newMinZoom);
        map.setMaxBounds(bounds)
        onZoomComplete()
      }, 490);
    } else{
      map.fitBounds(bounds, { padding: [50, 50] }); // Adjust padding for a better fit
      map.setMaxZoom(14);
      const newMinZoom = map.getBoundsZoom(bounds);
      map.setMinZoom(newMinZoom);
      map.setMaxBounds(bounds)
      onZoomComplete()
    }
  }, [map, bounds]);
  return null;
};