import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet'
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import IndonesiaJson from '../../data/indonesia.json'
import { useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion } from "motion/react"
import Button from '../../component/Button';

const geojsonData: FeatureCollection = IndonesiaJson as FeatureCollection

function Home() {
  const navigate = useNavigate();
  const location = useLocation()
  const fromProvince: boolean = location.state ? location.state?.scrollable : true;

  /** function to expand bbox by amount of margin */
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

  // setting up map bounds
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

  /** setting style for each area and hover style */
  const getFeatureStyle = (feature: any) => {
    return { 
      fillColor: HoveredName === feature.properties.name ? "#ff0000" : "transparent",
      fillOpacity: HoveredName === feature.properties.name ? 0.4 : 0,
      color: "#ff0000",
      weight: 1,
    };
  };

  /** zoom animate to bounds and navigate to /provinceName */
  function animateZoomToProvince(map: L.Map,bounds: L.LatLngBounds, provinceName: string) {
    map.flyToBounds(bounds, { duration: 0.7 }); // ✅ Smooth zoom-in animation
    setZoomIn(true)
    const encodedProvince = provinceName.replace(/ /g, "_");
    console.log("encodedprov", encodedProvince);
    
    setTimeout(() => {
      navigate(`/${encodedProvince}`, { state: bounds }); // ✅ Change route AFTER animation
    }, 700);
  }

  return (
    <div className={`w-full h-screen relative ${scrollable ? 'overflow-y-visible': 'overflow-y-hidden'}`}>
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
            <Button 
              title='Mulai Main!'
              onClick={() => {
                setScrollable(false)
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ ease: "easeInOut" }}
              className='bottom-20'
              width={216}
              zIndex={20}
              position='absolute'
            />
          </div>
        )}
      </AnimatePresence>
      {(geojsonData && !scrollable && !zoomIn) && (
        <div className='absolute h-screen w-full top-0 flex items-center justify-center'>
          <h2 className='absolute z-[400] text-3xl font-bold top-10 right-0 left-0'>Pilih Provinsi!</h2>
          <h2 className='absolute z-[400] text-3xl font-bold bottom-25 right-0 left-0'>{HoveredName}</h2>
          <Button 
            title='Kembali'
            onClick={() => {
              setScrollable(true)
            }}
            className='bottom-10'
            width={160}
            zIndex={9999}
            position='absolute'
          />
        </div>
      )}
      <footer className='flex p-4 bg-gray-800 text-white flex-col items-start gap-y-2'>
        <p>Created by <a href="https://github.com/rereard" target='_blank'>rereard</a> | Project's repo <a href='https://github.com/rereard/tebakkabupaten' target='_blank'>here</a></p>
        <p className='text-justify'>
          Website ini menggunakan data dari <a className='hover:underline text-blue-400' href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, 
          diekstrak menggunakan <a href="https://overpass-turbo.eu/" target="_blank">Overpass Turbo</a>, 
          disederhanakan dengan <a href="https://mapshaper.org/" target="_blank">Mapshaper</a>, 
          ditampilkan menggunakan <a href="https://leafletjs.com/" target="_blank">Leaflet</a>, 
          dan menggunakan map tiles dari <a href="https://carto.com/" target="_blank">Carto Voyager (no labels)</a>.
        </p>
        <p className='self-center'>Work in Progress~</p>
      </footer>
    </div>
  )
}

/** map bounds, min and max zoom setting */
const FitMapBounds: React.FC<{ bounds: [[number, number], [number, number]] }> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] }); // Adjust padding for a better fit
      map.setMaxZoom(14);

      const newMinZoom = map.getBoundsZoom(bounds);

      map.setMinZoom(newMinZoom + 0.3);
      map.setMaxBounds(bounds)
    }
  }, [map, bounds]);
  return null;
};

export default Home
