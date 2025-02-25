import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

type GeoJSONModule = { default: FeatureCollection<Geometry, GeoJsonProperties> };

const selector: Record<string, () => Promise<GeoJSONModule>> = {
  "Jawa Tengah": () => import("../data/jateng.json") as Promise<GeoJSONModule>,
  "Jawa Timur": () => import("../data/jatim.json") as Promise<GeoJSONModule>,
  "Jawa Barat": () => import("../data/jabar.json") as Promise<GeoJSONModule>,
  "Banten": () => import("../data/banten.json") as Promise<GeoJSONModule>,
  "Daerah Istimewa Yogyakarta": () => import("../data/diy.json") as Promise<GeoJSONModule>,
  "DKI Jakarta": () => import("../data/jakarta.json") as Promise<GeoJSONModule>,
  "Bali": () => import("../data/bali.json") as Promise<GeoJSONModule>,
  "Nusa Tenggara Barat": () => import("../data/ntb.json") as Promise<GeoJSONModule>,
  "Nusa Tenggara Timur": () => import("../data/ntt.json") as Promise<GeoJSONModule>,
};

export default selector;