/** function to expand bbox by amount of margin */
const expandBBox = (bbox: number[], margin: number) => {
  return [
    bbox[0] - margin, // minLng - margin
    bbox[1] - margin, // minLat - margin
    bbox[2] + margin, // maxLng + margin
    bbox[3] + margin, // maxLat + margin
  ];
};

export default expandBBox