import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet'
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { motion } from "motion/react"
import { useLocation, useNavigate, useParams } from 'react-router';
import Button from '../../component/Button';
import Spinner from '../../component/Spinner';

/** shuffling array */
const shuffleArray = (array: string[]) => array.sort(() => Math.random() - 0.5);

/** function to expand bbox by amount of margin */
const expandBBox = (bbox: number[], margin: number) => {
  return [
    bbox[0] - margin, // minLng - margin
    bbox[1] - margin, // minLat - margin
    bbox[2] + margin, // maxLng + margin
    bbox[3] + margin, // maxLat + margin
  ];
};

export default function Province(){

  const navigate = useNavigate()
  const location = useLocation()
  const indonesiaBounds = location.state?.bounds || [[-11, 94], [6, 141]];
  const { provinceName } = useParams<{ provinceName: string }>();

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

  // setting geojson data and map bounds
  useEffect(() => {
    if (!provinceName) return;

    setGeojsonData(null); // Reset while loading new data
    setGeojsonLoaded(false)

    fetch(`/data/${provinceName}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${provinceName}.json`);
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

        // setting quiz list
        const areaNames =data.features.map((feature: any) => feature.properties.name || "Unknown")
        setAllAreas(areaNames)
      })
      .catch((err) => console.error("Failed to load GeoJSON:", err));
  }, []);

  // used for state inside MapContainer
  const currentQuestionRef = useRef(currentQuestion);
  const quizListRef = useRef(quizList);
  const answeredAreasRef = useRef(answeredAreas);
  const boundsRef = useRef(bounds);
  const isPlayingRef = useRef(isPlaying);

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
    if(geojsonLoaded && quizList.length === 0){
      setIsOpen(true)
      setIsPlaying(false)
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

  // counting correct and wrong answer
  const { correctCount, wrongCount } = useMemo(() => {
    return Object.values(answeredAreas).reduce(
      (acc, value) => {
        if (value === "correct") acc.correctCount++;
        else if (value === "wrong") acc.wrongCount++;
        return acc;
      },
      { correctCount: 0, wrongCount: 0 }
    );
  }, [answeredAreas])

  return(
    <div className='w-full h-screen relative flex items-center justify-center'>
      <title>{`${provinceName} - Tebak Kabupaten & Kota Indonesia`}</title>
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
            onEachFeature={(feature: any, layer: any) => {
              const clickedName = feature.properties.name;
              layer.on({
                mouseover: (e: any) => {
                  if(!answeredAreasRef.current[clickedName]){
                    e.target.setStyle({ fillColor: "red", fillOpacity: 0.3 })
                  } else{
                      layer.bindTooltip(clickedName, {
                        direction: "center",
                      }).openTooltip();
                  }
                },
                mouseout: (e: any) => {
                  if(!answeredAreasRef.current[clickedName]){
                    e.target.setStyle(getFeatureStyle(feature))
                  }
                  layer.unbindTooltip(); // type error when played the game twice, not breaking the apps (see console)
                },
                click: () => {
                  if(isPlayingRef.current){
                    if(!answeredAreasRef.current[clickedName]){
                      if (clickedName === currentQuestionRef.current) {
                        console.log("correct");
                        const filtered = quizListRef.current.filter((name) => name !== currentQuestionRef.current)
                        setAnsweredAreas((prev) => ({ ...prev, [clickedName]: "correct" })); 
                        setQuizList(filtered);
                        setCurrentQuestion(filtered[0] || null); 
                      } else{
                        console.log("wrong");
                        const correctAnswer = currentQuestionRef.current!;
                        const filtered = quizListRef.current.filter((name) => name !== clickedName && name !== currentQuestionRef.current)
                        setAnsweredAreas((prev) => ({ ...prev, [clickedName]: "wrong", [correctAnswer]: "wrong", }));
                        setQuizList(filtered);
                        setCurrentQuestion(filtered[0] || null);
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
      {(geojsonLoaded && !zoomOut) && (
        <>
          <h2 className='absolute z-[400] text-2xl font-bold top-10 right-0 left-0'>{Object.values(answeredAreas).length === 0 ? null : `✅${correctCount} ❌${wrongCount}`}</h2>
          <h2 className='absolute z-[9999] text-2xl font-bold bottom-10 right-0 left-0'>{currentQuestion ? currentQuestion+"?" : null}</h2>
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
      {modalIsOpen && (
        <div className='absolute bg-black/40 bg-op z-[9999] top-0 w-full h-screen flex justify-center items-center'>
          <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{  opacity: 1, y:0 }} transition={{ duration: 0.3, ease: "easeOut" }} className='bg-white flex flex-col items-center p-6 rounded-lg shadow-xl w-fit border-4 relative'>
            <h2 className="text-2xl font-bold">{Object.values(answeredAreas).length === 0 ? `Provinsi ${provinceName}` : 'Permainan selesai!'}</h2>
            <button className='absolute top-3 right-5 text-2xl font-bold cursor-pointer text-[#ff0000]' onClick={() => setIsOpen(false)}>x</button>
            {!geojsonLoaded ? (
              <Spinner />
            ) : 
            <>
              {Object.values(answeredAreas).length === 0 ? (
                <p className="text-lg mt-2">{allAreas.length} Kabupaten dan Kota</p>
              ) : (
                <>
                  <p className="text-lg mt-2">✅Tebakan benar: {Object.values(answeredAreas).filter(v => v === "correct").length}</p>
                  <p className="text-lg">❌Tebakan salah: {Object.values(answeredAreas).filter(v => v === "wrong").length}</p>
                </>
              )}
              <div className='my-4 h-fit max-h-56 overflow-y-auto'>
                <ol className='list-decimal list-inside columns-2 pl-5 text-left'>
                  {Object.keys(answeredAreas).length === 0 ? (
                    allAreas.map((name, index) => (<li className='text-black font-medium' key={index}>{name}</li>))
                  ) : 
                  Object.keys(answeredAreas).map((key, index) => (
                    <li className={`${answeredAreas[key] === "wrong" ? 'text-red-600' : answeredAreas[key] === "correct" ? 'text-green-600' : 'text-black' } font-medium`} key={index}>{key}</li>
                  ))}
                </ol>
              </div>
            </>
            }
            <div className='text-white w-11/12 flex justify-between'>
              <Button 
                title='Kembali'
                onClick={() => {
                  setZoomOut(true)
                  setIsOpen(false)
                  const shuffleAreaList = shuffleArray([...allAreas])
                  setQuizList(shuffleAreaList)
                  setCurrentQuestion(shuffleAreaList[0])
                  setAnsweredAreas({})
                }}
              />
              <Button 
                disabled={!geojsonLoaded}
                className=' disabled:bg-blue-200 disabled:outline-gray-300 disabled:cursor-auto'
                title={Object.keys(answeredAreas).length === 0 ? 'Main' : 'Ulang'}
                onClick={() => {
                  if(Object.keys(answeredAreas).length === 0){
                    const shuffledAreas = shuffleArray([...allAreas])
                    setQuizList(shuffleArray(shuffledAreas))
                    setCurrentQuestion(shuffledAreas[0] || null)
                  } else{
                    const shuffleAreaList = shuffleArray([...allAreas])
                    setQuizList(shuffleAreaList)
                    setCurrentQuestion(shuffleAreaList[0])
                    setAnsweredAreas({})
                  }
                  setIsOpen(false)
                  setIsPlaying(true)
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

/** map bounds, min and max zoom setting */
const FitMapBounds: React.FC<{ bounds: [[number, number], [number, number]] }> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] }); // Adjust padding for a better fit
      // map.setMaxBounds(null);
      map.setMaxBounds(undefined);
      map.setMinZoom(1);
      map.setMaxZoom(14);

      const newMinZoom = map.getBoundsZoom(bounds);

      map.flyToBounds(bounds, { duration: 1.5 });

      map.setMinZoom(newMinZoom + 0.4);
      map.setMaxBounds(bounds)

      console.log("New Bounds Applied: ", bounds);
      console.log("Updated Zoom Limits - Min:", newMinZoom, "Max: 14");
    }
  }, [map, bounds]);
  return null;
};

/** setting for zoom out animation when going back to Home page */
const MapZoomHandler = ({ zoomOut, bounds, onZoomComplete }: { zoomOut: boolean; bounds: [[number, number], [number, number]]; onZoomComplete: () => void }) => {
  const map = useMap();

  useEffect(() => {
    if (zoomOut) {
      map.fitBounds(bounds, { padding: [50, 50] });
      map.setMaxBounds(undefined);
      map.setMinZoom(1);
      map.setMaxZoom(14);
      const newMinZoom = map.getBoundsZoom(bounds);

      map.flyToBounds(bounds, { duration: 0.5 });

      map.setMinZoom(newMinZoom + 0.4);
      map.setMaxBounds(bounds)

      setTimeout(() => {
        onZoomComplete(); // Navigate home after animation
      }, 500)
    }
  }, [zoomOut, map, bounds, onZoomComplete]);

  return null;
};