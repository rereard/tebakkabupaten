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
import expandBBox from '../../utils/expandBbox';

const geojsonData: FeatureCollection = IndonesiaJson as FeatureCollection

function Home() {
  const navigate = useNavigate();
  const location = useLocation()
  const fromProvince: boolean = location.state ? location.state?.scrollable : true;

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
      fillOpacity: HoveredName === feature.properties.name ? 0.3 : 0,
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
    <div className={`${scrollable ? 'overflow-y-visible': 'overflow-y-hidden'} w-full h-screen`}>
      <section className={`w-full h-full relative`}>
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
                className='text-base sm:text-xl md:text-2xl lg:text-5xl z-20 font-bold absolute top-10 right-0 text-black left-0 flex justify-center items-center'
              >
                <img loading='lazy' src="/thumbnail.png" alt="Website's Icon" className='w-20 sm:w-24 md:w-36 lg:w-52' /> <span className='text-left'><p>TEBAK KABUPATEN & KOTA</p><p>INDONESIA</p></span>
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
      </section>
      <section className='bg-[#f6f6f6] flex flex-col items-start text-justify p-10 text-sm md:text-base'>
        <h1 className='text-xl md:text-2xl lg:text-3xl border-l-4 pl-2 mb-4'>Tentang</h1>
        <p>Tebak Kabupaten & Kota Indonesia adalah website interaktif yang menguji pengetahuanmu tentang letak geografis kabupaten dan kota di Indonesia. Pilih salah satu dari 38 provinsi Indonesia lalu kamu akan diberikan nama sebuah kabupaten atau kota dan tugasmu adalah mengklik lokasi yang benar di peta. Setiap sesi permainan akan mencatat riwayat skor terbaru, sehingga kamu bisa melihat perkembanganmu dari waktu ke waktu. Selamat bermain dan uji seberapa baik kamu mengenal peta Indonesia!</p>
        <p className='mt-2'>Fitur:</p>
        <ul className='list-disc list-inside'>
          <li>Semua kabupaten dan kota di seluruh 38 Provinsi Indonesia</li>
          <li>Empat mode permainan (Kasual, Sudden Death, Time Trial, Ultimate Challenge)</li>
          <li>Riwayat bermain</li>
        </ul>
      </section>
      <footer className='flex text-xs md:text-sm lg:text-base p-5 bg-gray-800 text-white flex-col items-start gap-y-2'>
        <p className='text-left'>Created by <a href="https://github.com/rereard" target='_blank'>rereard</a> | Project's repo <a href='https://github.com/rereard/tebakkabupaten' target='_blank'>here</a></p>
        <p className='text-justify'>
          Website ini menggunakan data <a className='hover:underline text-blue-400' href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> (extracted via <a href="https://overpass-turbo.eu/" target="_blank">Overpass Turbo</a>) 
          dan menggunakan map tiles <a href="https://carto.com/" target="_blank">Carto Voyager (no labels)</a>.
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
