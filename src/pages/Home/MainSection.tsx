import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { indonesiaGeoJson } from '../../utils/indonesiaJSONdata';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as turf from "@turf/turf";
import expandBBox from '../../utils/expandBbox';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { AnimatePresence, motion } from 'motion/react';
import Button from '../../component/Button';
import FitMapBounds from "../../component/FitMapBounds";

type MainSectionProps = {
  scrollable: boolean
  setScrollable: (n: boolean) => void
}

export default function MainSection({ scrollable, setScrollable }: MainSectionProps) {

  const navigate = useNavigate();

  const [HoveredName, setHoveredName] = useState<string | null>(null)
  const [zoomIn, setZoomIn] = useState<boolean>(false)
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null)

   // setting up map bounds
   useEffect(() => {
    // merge geojson feature to calculate bounds
    const mergedFeatureCollection = turf.combine(indonesiaGeoJson as FeatureCollection<Polygon | MultiPolygon>)
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

  return(
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
          {indonesiaGeoJson && (
            <GeoJSON
              data={indonesiaGeoJson}
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
              <img loading='lazy' src="/thumbnail.webp" alt="Website's Icon" className='w-20 sm:w-24 md:w-36 lg:w-52' /> <span className='text-left'><p>TEBAK KABUPATEN & KOTA</p><p>INDONESIA</p></span>
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
      {(indonesiaGeoJson && !scrollable && !zoomIn) && (
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
          <Button 
            title='Survival Mode'
            onClick={() => {
              navigate('/survival')
            }}
            className='top-20 md:top-8 md:right-12'
            width={160}
            zIndex={9999}
            position='absolute'
          />
        </div>
      )}
    </section>
  )
}