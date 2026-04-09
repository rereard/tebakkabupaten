import { useMap } from 'react-leaflet/hooks'
import { useEffect } from 'react'

type FitMapBoundsProps = {
  bounds: [[number, number], [number, number]];
  /** Optional callback fired after bounds are applied */
  onZoomComplete?: () => void;
  /** When true, uses flyToBounds animation before fitting */
  zooming?: boolean;
}

/** map bounds, min and max zoom setting */
const FitMapBounds: React.FC<FitMapBoundsProps> = ({ bounds, onZoomComplete, zooming }) => {
  const map = useMap();
  useEffect(() => {
    if (!bounds) return;

    if (zooming) {
      map.flyToBounds(bounds, { duration: 0.5 });
      setTimeout(() => {
        map.fitBounds(bounds, { padding: [50, 50] });
        map.setMaxZoom(14);
        const newMinZoom = map.getBoundsZoom(bounds);
        map.setMinZoom(newMinZoom);
        map.setMaxBounds(bounds);
        onZoomComplete?.();
      }, 490);
    } else {
      map.fitBounds(bounds, { padding: [50, 50] });
      map.setMaxZoom(14);
      const newMinZoom = map.getBoundsZoom(bounds);
      map.setMinZoom(newMinZoom + 0.4);
      map.setMaxBounds(bounds);
      onZoomComplete?.();
    }
  }, [map, bounds]);
  return null;
};

export default FitMapBounds
