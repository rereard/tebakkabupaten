import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet'
import * as turf from "@turf/turf";
import './App.css'
import "leaflet/dist/leaflet.css";
import jatengJSON from "../src/data/jateng.json";
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
const geojsonData: FeatureCollection = jatengJSON as FeatureCollection;
// const geojsonData2: Feature = jateng2JSON as Feature;

const allAreas = geojsonData.features.map((feature: any) => feature.properties.name);
const shuffleArray = (array: string[]) => array.sort(() => Math.random() - 0.5);

function App() {

  const [quizList, setQuizList] = useState<string[]>(shuffleArray([...allAreas]));
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(quizList[0]); // First question
  const [answeredAreas, setAnsweredAreas] = useState<{ [key: string]: "correct" | "wrong" }>({});

  const currentQuestionRef = useRef(currentQuestion);
  const quizListRef = useRef(quizList);
  const answeredAreasRef = useRef(answeredAreas);

  useEffect(() => {
    console.log("quizList", quizList);
    console.log("currentQuestion", currentQuestion);
    console.log("answeredAreas", answeredAreas);
  }, [quizList, currentQuestion, answeredAreas]);

  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);
  useEffect(() => {
    quizListRef.current = quizList;
  }, [quizList]);
  useEffect(() => {
    answeredAreasRef.current = answeredAreas;
  }, [answeredAreas]);

  // Set Style for Each Area
  const getFeatureStyle = (feature: any) => {
    const name = feature.properties.name;
    if (answeredAreas[name] === "correct") {
      return { fillColor: "green", fillOpacity: 0.6, color: "black", weight: 1 };
    } else if (answeredAreas[name] === "wrong") {
      return { fillColor: "red", fillOpacity: 0.6, color: "black", weight: 1 };
    }
    return { fillColor: "transparent", fillOpacity: 0, color: "red", weight: 1 };
  };

  const geojsonData3 = geojsonData as FeatureCollection<Polygon | MultiPolygon>;
  const mergedFeatureCollection = turf.combine(geojsonData3);
  const mergedFeature = mergedFeatureCollection.features[0] as Feature<Polygon | MultiPolygon>;
  if (!mergedFeature) {
    console.error("Failed to merge Central Java features.");
    return <p>Error loading map</p>;
  }
  const mask = turf.mask(mergedFeature) as Feature<Polygon | MultiPolygon>;

  const bbox = turf.bbox(mergedFeature); // [minX, minY, maxX, maxY]
  const expandBBox = (bbox: number[], margin: number) => {
    return [
      bbox[0] - margin, // minLng - margin
      bbox[1] - margin, // minLat - margin
      bbox[2] + margin, // maxLng + margin
      bbox[3] + margin, // maxLat + margin
    ];
  };
  const expandedBBox = expandBBox(bbox, 0.5);
  const bounds: [[number, number], [number, number]] = [
    [expandedBBox[1], expandedBBox[0]], // Southwest corner (lat, lon)
    [expandedBBox[3], expandedBBox[2]], // Northeast corner (lat, lon)
  ];

  return (
    <div className='w-full h-screen relative'>
      <MapContainer 
        zoomControl={true} 
        dragging={true} 
        scrollWheelZoom={true}
        doubleClickZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png"
        />
        {/* 🛑 Apply the mask (Hide outside area) */}
        {mask && (
          <GeoJSON data={mask} style={{ fillColor: "white", fillOpacity: 1, color: "none" }} />
        )}
          <GeoJSON
            data={geojsonData}
            style={getFeatureStyle}
            onEachFeature={(feature: any, layer: any) => {
              const clickedName = feature.properties.name;
              layer.on({
                mouseover: (e: any) => {
                  if(!answeredAreasRef.current[clickedName]){
                    e.target.setStyle({ fillColor: "red", fillOpacity: 0.4 })
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
                  layer.closeTooltip();
                },
                click: () => {
                  if(!answeredAreasRef.current[clickedName]){
                    console.log("current", currentQuestionRef.current);
                    console.log("clicked", clickedName);
                    if (clickedName === currentQuestionRef.current) {
                      console.log("correct");
                      const filtered = quizListRef.current.filter((name) => name !== currentQuestionRef.current)
                      console.log("filtered", filtered);
                      setAnsweredAreas((prev) => ({ ...prev, [clickedName]: "correct" })); 
                      setQuizList(filtered);
                      setCurrentQuestion(filtered[0] || null); 
                    } else{
                      console.log("wrong");
                      const correctAnswer = currentQuestionRef.current!;
                      const filtered = quizListRef.current.filter((name) => name !== clickedName && name !== currentQuestionRef.current)
                      console.log("filtered", filtered);
                      setAnsweredAreas((prev) => ({ ...prev, [clickedName]: "wrong", [correctAnswer]: "wrong", }));
                      setQuizList(filtered);
                      setCurrentQuestion(filtered[0] || null);
                    }
                  }
                }   
              })
            }}
          />
        <FitMapBounds bounds={bounds} />
      </MapContainer>
      <h2 className='absolute z-[9999] text-2xl font-bold bottom-10 right-0 left-0'>{currentQuestion ? currentQuestion+"?" : "Quiz Completed!"}</h2>
      <div className='absolute z-[1000] top-0 right-0 h-56 w-fit overflow-y-scroll'>
        <ul className='list-disc pl-5 text-left columns-2 space-x-2'>
          {allAreas.map((name, index) => (
            <li className={`break-inside-avoid ${answeredAreas[name] === "wrong" ? 'text-red-600' : answeredAreas[name] === "correct" ? 'text-green-600' : 'text-black' } font-medium`} key={index}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const FitMapBounds: React.FC<{ bounds: [[number, number], [number, number]] }> = ({ bounds }) => {
  const map = useMap();
  const hasSetBounds = useRef(false); // Prevents reapplying bounds after first load
  useEffect(() => {
    if (!hasSetBounds.current) {
      map.fitBounds(bounds, { padding: [50, 50] }); // Adjust padding for a better fit
      map.setMaxBounds(bounds);
      map.setMinZoom(map.getBoundsZoom(bounds))
      hasSetBounds.current = true;
    }
  }, [map, bounds]);
  return null;
};

export default App
