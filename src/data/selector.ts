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
  "Lampung": () => import("../data/lampung.json") as Promise<GeoJSONModule>,
  "Sumatera Selatan": () => import("../data/sumsel.json") as Promise<GeoJSONModule>,
  "Kepulauan Bangka Belitung": () => import("../data/babel.json") as Promise<GeoJSONModule>,
  "Bengkulu": () => import("../data/bengkulu.json") as Promise<GeoJSONModule>,
  "Jambi": () => import("../data/jambi.json") as Promise<GeoJSONModule>,
  "Kepulauan Riau": () => import("../data/kepri.json") as Promise<GeoJSONModule>,
  "Riau": () => import("../data/riau.json") as Promise<GeoJSONModule>,
  "Sumatera Barat": () => import("../data/sumbar.json") as Promise<GeoJSONModule>,
  "Sumatera Utara": () => import("../data/sumut.json") as Promise<GeoJSONModule>,
  "Aceh": () => import("../data/aceh.json") as Promise<GeoJSONModule>,
};

export default selector;