import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet'
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import IndonesiaJson from '../../data/indonesia.json'
import { useNavigate } from 'react-router';

const geojsonData: FeatureCollection = IndonesiaJson as FeatureCollection

function Home() {
  const navigate = useNavigate();
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
      fillColor: HoveredName === feature.properties.name ? "red" : "transparent",
      fillOpacity: HoveredName === feature.properties.name ? 0.4 : 0,
      color: "red",
      weight: 1,
    };
  };

  function animateZoomToProvince(map: L.Map,bounds: L.LatLngBounds, provinceName: string) {
    map.flyToBounds(bounds, { duration: 1 }); // ✅ Smooth zoom-in animation

    setTimeout(() => {
      navigate(`/${provinceName}`, { state: bounds }); // ✅ Change route AFTER animation
    }, 1000);
  }

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
      {geojsonData && (
        <>
          <h2 className='absolute z-[400] text-2xl font-bold top-10 right-0 left-0'>Pilih Provinsi!</h2>
          <h2 className='absolute z-[9999] text-2xl font-bold bottom-10 right-0 left-0'>{HoveredName}</h2>
        </>
      )}
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
