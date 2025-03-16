import { useMap } from 'react-leaflet/hooks'
import { useEffect } from 'react'

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

export default MapZoomHandler