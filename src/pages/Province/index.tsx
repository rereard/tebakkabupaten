import { useMemo } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { motion } from "motion/react"
import { useLocation, useNavigate, useParams } from 'react-router';
import Button from '../../component/Button';
import Spinner from '../../component/Spinner';
import CheckLabel from '../../component/CheckLabel';
import FitMapBounds from '../../component/FitMapBounds';
import MapZoomHandler from './MapZoomHandler';
import ModalContainer from '../../component/ModalContainer';
import NavComponent from '../../component/NavComponent';
import AreaList from '../../component/AreaList';
import { GameHistoryComponent } from '../../component/GameHistoryComponent';
import { GameMode } from '../../utils/gameMode';
import { useProvinceGame } from '../../utils/useProvinceGame';



export default function Province(){

  const navigate = useNavigate()
  const location = useLocation()
  const indonesiaBounds = location.state?.bounds || [[-11, 94], [6, 141]];
  const { provinceName } = useParams<{ provinceName: string }>();
  const decodedProvince = provinceName?.replace(/_/g, " ");
  
  const { state, refs, actions, stopwatch } = useProvinceGame(decodedProvince);

  const {
      geojsonData, bounds, zoomOut, geojsonLoaded, allAreas, currentQuestion, answeredAreas,
      modalIsOpen, setIsOpen, isPlaying, gameMode, setGameMode, savedTime, isError, mapKey, gameNav,
      setGameNav, gameHistory
  } = state;

  const { answeredAreasRef } = refs;
  const { handleAreaClick, startGame, backToMap, fetchMapData } = actions;

  /** setting style for each area, hover style, and fill area if wrong or correct */
  const getFeatureStyle = (feature: any) => {
    const name = feature.properties.name;
    if (answeredAreas[name] === "correct") {
      return { fillColor: "green", fillOpacity: 0.6, color: "black", weight: 1 };
    } else if (answeredAreas[name] === "wrong") {
      return { fillColor: "red", fillOpacity: 0.6, color: "black", weight: 1 };
    }
    return { fillColor: "transparent", fillOpacity: 0, color: "red", weight: 1 };
  };

  // prevent map rerendering when stopwatch started
  const MemoizedMap = useMemo(() => (
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
          key={mapKey}
          data={geojsonData}
          style={getFeatureStyle}
          onEachFeature={(feature, layer) => {
            const clickedName = feature.properties.name;            
            layer.on({
              mouseover: (e) => {
                if(!answeredAreasRef.current[clickedName]){
                  e.target.setStyle({ fillColor: "red", fillOpacity: 0.3 })
                } else{
                  layer.bindTooltip(clickedName, {
                    direction: "center",
                  }).openTooltip();
                }
              },
              mouseout: (e) => {
                if(!answeredAreasRef.current[clickedName]){
                  e.target.setStyle(getFeatureStyle(feature))
                }
                layer.unbindTooltip();
              },
              click: () => {
                handleAreaClick(clickedName)
              }   
            })
          }}
        />
      )}
      {bounds && <FitMapBounds bounds={bounds} />}
      <MapZoomHandler zoomOut={zoomOut} bounds={indonesiaBounds} onZoomComplete={() => navigate("/", { state: { scrollable: false } })} />
    </MapContainer>
  ), [answeredAreas, geojsonData, mapKey]);

  return(
    <div className='w-full h-screen relative flex items-center justify-center'>
      <title>{`${decodedProvince} - Tebak Kabupaten & Kota Indonesia`}</title>
      <meta name="description" content={`Tebak semua kabupaten dan kota di Provinsi ${decodedProvince}! Uji pengetahuan geografi Indonesia-mu dengan kuis peta interaktif. ${allAreas.length} daerah untuk ditebak.`} />
      {MemoizedMap}
      {(geojsonLoaded && !zoomOut) && (
        <>
          <h2 className='absolute z-[400] text-2xl font-bold top-10 right-0 left-0'>{currentQuestion ? `${Object.values(answeredAreas).length}/${allAreas.length}`: null}</h2>
          <h2 className='absolute z-[9999] text-2xl font-bold bottom-10 right-0 left-0'>{currentQuestion ? currentQuestion+"?" : null}</h2>
          {((gameMode === GameMode.TimeTrial || gameMode === GameMode.Mix) && isPlaying) && <h2 className='absolute z-[400] text-2xl font-bold top-20 right-0 left-0'>{stopwatch.formattedTime}</h2>}
        </>
      )}
      {(!modalIsOpen && !isPlaying && !zoomOut) && (
        <Button 
          title='Kembali'
          className='bottom-20'
          zIndex={400}
          position='absolute'
          onClick={() => {
            setIsOpen(true)
          }}
        />
      )}

      {/* Modal Component */}
      <ModalContainer
        isOpen={modalIsOpen}
        leftButtonTitle='Kembali'
        leftButtonFunction={backToMap}
        rightButtonTitle={Object.keys(answeredAreas).length === 0 ? 'Main' : 'Ulang'}
        rightButtonDisabled={!geojsonLoaded}
        rightButtonFunction={startGame}
      >
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2">{Object.values(answeredAreas).length === 0 ? `Provinsi ${decodedProvince}` : 'Permainan selesai!'}</h2>
        <motion.button disabled={!geojsonLoaded} whileHover={ geojsonLoaded ? { scale: 1.07 } : {}} className='absolute top-2 right-2 text-xs md:text-sm border rounded-2xl px-2 font-bold cursor-pointer text-[#ff0000] disabled:text-[#ff7979] disabled:cursor-auto' onClick={() => setIsOpen(false)}>lihat peta</motion.button>
        {(!geojsonLoaded && !isError) ? (
          <Spinner />
        ) : 
        !isError ? (
          <>
            <NavComponent 
              setNavIndex={setGameNav}
              navIndex={gameNav}
              navList={['Permainan', 'Riwayat']}
            />
            {gameNav === 1 && (
              gameHistory.length === 0 ? (
                <div className='my-7'>
                  <p className=' italic'>Belum ada riwayat bermain di provinsi ini...</p>
                </div>
              ) : (
                <>
                  <GameHistoryComponent 
                    data={gameHistory}
                    className='max-h-56 overflow-y-auto'
                  />
                  <p className='text-gray-400 my-2 italic'>Hanya 5 permainan terakhir yang disimpan...</p>
                </>
              )
            )}
            {gameNav === 0 && (
              <>
                {Object.values(answeredAreas).length === 0 ? (
                  <p className="text-base md:text-lg mt-2">{allAreas.length} Kabupaten dan Kota</p>
                ) : (
                  <p className='text-base md:text-lg mt-2'>Hasil: {Object.values(answeredAreas).filter(v => v === "correct").length}/{allAreas.length}{savedTime && ` | Waktu ${savedTime}`}</p>
                )}
                <div className='my-4 h-fit w-full max-h-56 overflow-y-auto'>
                  <AreaList 
                    allAreas={allAreas}
                    answeredAreas={answeredAreas}
                  />
                </div>
                <div className='p-2 mb-4 flex flex-col w-full gap-1'>
                  <div className='flex items-center text-sm md:text-base'>
                    <span className='flex-1 md:flex-0'>Mode:</span>
                    <div className='flex-1 flex flex-col sm:flex-row justify-around'>
                      <CheckLabel 
                        checked={gameMode === GameMode.Casual ? true : false}
                        onChange={() => setGameMode(GameMode.Casual)}
                        title='Kasual'
                      />
                      <CheckLabel 
                        checked={(gameMode === GameMode.SuddenDeath || gameMode === GameMode.Mix) ? true : false}
                        onChange={() => {
                          if(gameMode === GameMode.TimeTrial){
                            setGameMode(GameMode.Mix)
                          } else if(gameMode === GameMode.Mix){
                            setGameMode(GameMode.TimeTrial)
                          } else{
                            setGameMode(GameMode.SuddenDeath)
                          }
                        }}
                        title='Sudden-Death'
                      />
                      <CheckLabel 
                        checked={(gameMode === GameMode.TimeTrial || gameMode === GameMode.Mix) ? true : false}
                        onChange={() => {
                          if(gameMode === GameMode.SuddenDeath){
                            setGameMode(GameMode.Mix)
                          } else if(gameMode === GameMode.Mix){
                            setGameMode(GameMode.SuddenDeath)
                          } else{
                            setGameMode(GameMode.TimeTrial)
                          }
                        }}
                        title='Time Trial'
                      />
                    </div>
                  </div>
                  <div className='w-full max-w-96 self-center font-bold italic text-xs md:text-sm'>
                    <p>{gameMode === GameMode.Casual ? 'Tebak tanpa batasan waktu atau penalti. Cocok untuk belajar sambil santai!' : gameMode === GameMode.SuddenDeath ? 'Satu kesalahan, game over! Uji ketepatan tanpa ruang untuk salah.' : gameMode === GameMode.TimeTrial  ? 'Selesaikan secepat mungkin! Jika salah waktu bertambah 10 detik!' : 'Ultimate Challenge! Cepat dan tepat, atau game over!'}</p>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className='my-7 flex flex-col gap-2'>
            <p>Gagal memuat...</p>
            <Button 
              title='Coba Lagi'
              onClick={() => {
                fetchMapData()
              }}
            />
          </div>
        )}
      </ModalContainer>
    </div>
  )
}