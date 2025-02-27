import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet'
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import IndonesiaJson from '../../data/indonesia.json'
import { useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion } from "motion/react"

const geojsonData: FeatureCollection = IndonesiaJson as FeatureCollection

function Home() {
  const navigate = useNavigate();
  const location = useLocation()
  const fromProvince: boolean = location.state ? location.state?.scrollable : true;

  useEffect(() => {
    console.log("fromProvince?", location.state)
  }, []);

  const expandBBox = (bbox: number[], margin: number) => {
    return [
      bbox[0] - margin, // minLng - margin
      bbox[1] - margin, // minLat - margin
      bbox[2] + margin, // maxLng + margin
      bbox[3] + margin, // maxLat + margin
    ];
  };
  const [HoveredName, setHoveredName] = useState<string | null>(null)
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null)
  const [scrollable, setScrollable] = useState<boolean>(fromProvince)
  const [zoomIn, setZoomIn] = useState<boolean>(false)

  useEffect(() => {
    // merge geojson feature to calculate bounds
    const mergedFeatureCollection = turf.combine(geojsonData as FeatureCollection<Polygon | MultiPolygon>)
    const mergedFeature = mergedFeatureCollection.features[0] as Feature<Polygon | MultiPolygon>;
    const bbox = turf.bbox(mergedFeature); // [minX, minY, maxX, maxY]
    const expandedBBox = expandBBox(bbox, 0.5);
    setBounds([
      [expandedBBox[1], expandedBBox[0]], // Southwest corner (lat, lon)
      [expandedBBox[3], expandedBBox[2]], // Northeast corner (lat, lon)
    ])
  }, []);

  // Set Style for Each Area
  const getFeatureStyle = (feature: any) => {
    return { 
      fillColor: HoveredName === feature.properties.name ? "#ff0000" : "transparent",
      fillOpacity: HoveredName === feature.properties.name ? 0.4 : 0,
      color: "#ff0000",
      weight: 1,
    };
  };

  function animateZoomToProvince(map: L.Map,bounds: L.LatLngBounds, provinceName: string) {
    map.flyToBounds(bounds, { duration: 0.7 }); // ✅ Smooth zoom-in animation
    setZoomIn(true)

    setTimeout(() => {
      navigate(`/${provinceName}`, { state: bounds }); // ✅ Change route AFTER animation
    }, 700);
  }

  return (
    <div className='w-full h-screen relative'>
      <title>Tebak Kabupaten & Kota Indonesia</title>
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
                const name = feature.properties.name;
                layer.on({
                  mouseover: () => {
                    setHoveredName(name)
                  },
                  mouseout: () => {
                    setHoveredName(null)
                  },
                  click: () => {
                    const map = layer._map; // ✅ Get the Leaflet map instance
                    if (map) animateZoomToProvince(map, layer.getBounds(), name);
                  }   
                })
              }}
            />
          )}
        {bounds && <FitMapBounds bounds={bounds} />}
      </MapContainer>
      <AnimatePresence>
        {scrollable && (
          <div className='absolute z-[9999] h-screen w-full top-0 flex items-center justify-center'>
            <motion.h1 
              exit={{ opacity: 0, y: -80 }}
              initial={{ opacity: 0, y: -80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: "easeInOut" }}
              className='text-5xl z-20 font-bold absolute top-10 border-y-4 border-black right-0 text-white left-0 bg-[#ff0000]'
            >
              TEBAK KABUPATEN & KOTA <p className='border-t-2 bg-white text-[#ff0000]'>INDONESIA</p>
            </motion.h1>
            <motion.button
              whileHover={{ backgroundColor: '#155dfc', scale: 1.05 }}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ ease: "easeInOut" }}
              onClick={() => setScrollable(false)}
              className='absolute z-20 bottom-20 bg-[#2b7fff] text-white p-2 w-54 outline-2 outline-blue-950 rounded-lg border-slate-400 shadow-lg cursor-pointer'
            >
              Mulai Main!
            </motion.button>
          </div>
        )}
      </AnimatePresence>
      {(geojsonData && !scrollable && !zoomIn) && (
        <div className='absolute h-screen w-full top-0 flex items-center justify-center'>
          <h2 className='absolute z-[400] text-3xl font-bold top-10 right-0 left-0'>Pilih Provinsi!</h2>
          <h2 className='absolute z-[400] text-3xl font-bold bottom-25 right-0 left-0'>{HoveredName}</h2>
          <motion.button
            whileHover={{ backgroundColor: '#155dfc', scale: 1.05 }}
            onClick={() => setScrollable(true)}
            className='absolute z-[400] bottom-10 bg-[#2b7fff] text-white p-2 w-40 outline-2 outline-blue-950 rounded-lg border-slate-400 shadow-lg cursor-pointer'
          >
            Kembali
          </motion.button>
        </div>
      )}
      <footer>
        Ini Footer!
      </footer>
    </div>
  )
}

const FitMapBounds: React.FC<{ bounds: [[number, number], [number, number]] }> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] }); // Adjust padding for a better fit
      map.setMaxZoom(14);

      const newMinZoom = map.getBoundsZoom(bounds);

      map.setMinZoom(newMinZoom + 0.3);
      map.setMaxBounds(bounds)

      console.log("New Bounds Applied: ", bounds);
      console.log("Updated Zoom Limits - Min:", newMinZoom, "Max: 14");
    }
  }, [map, bounds]);
  return null;
};

export default Home
