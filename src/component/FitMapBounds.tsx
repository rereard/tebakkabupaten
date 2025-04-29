import { useMap } from 'react-leaflet/hooks'
import { useEffect } from 'react'

/** map bounds, min and max zoom setting */
const FitMapBounds: React.FC<{ bounds: [[number, number], [number, number]] }> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] }); // Adjust padding for a better fit
      map.setMaxZoom(14);
      const newMinZoom = map.getBoundsZoom(bounds);
      // map.flyToBounds(bounds, { duration: 10 });
      map.setMinZoom(newMinZoom + 0.4);
      map.setMaxBounds(bounds)
    }
  }, [map, bounds]);
  return null;
};

export default FitMapBounds