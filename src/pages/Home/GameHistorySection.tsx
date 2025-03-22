import { useEffect, useState } from "react";
import NavComponent from "../../component/NavComponent";
import { GameHistoryItem, getGameHistory, getStoredProvinces } from "../../utils/gameHistory";
import { indonesiaGeoJson } from "../../utils/indonesiaJSONdata";
import { GameHistoryComponent } from "../../component/GameHistoryComponent";

export default function GameHistorySection(){

  const [historyNavIndex, setHistoryNavIndex] = useState<number>(0)
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([])
  const [storedProvincesHistories, setStoredProvincesHistories] = useState<string[]>([])

  useEffect(() => {
    const fetchStoredProvince = async () => {
      const stored = await getStoredProvinces(indonesiaGeoJson)
      setStoredProvincesHistories(stored)
    }
    fetchStoredProvince()
  }, []);

  useEffect(() => {
    const fetchGameHistory = async () => {
      const history = await getGameHistory(storedProvincesHistories[historyNavIndex])
      setGameHistory(history)
    }
    fetchGameHistory()
  }, [storedProvincesHistories, historyNavIndex])

  return(
    <section className='flex justify-center mt-10 px-10 text-sm md:text-base'>
      <div className='w-full lg:w-1/2 flex flex-col items-baseline text-left'>
        <h1 className='text-xl md:text-2xl lg:text-3xl font-medium border-l-4 border-[#00bcff] pl-2 mb-4'>Riwayat Bermain</h1>
        {gameHistory.length !== 0 ? (
          <>
            <NavComponent 
              navIndex={historyNavIndex}
              setNavIndex={setHistoryNavIndex}
              widthType='fit'
              navList={storedProvincesHistories}
            />
            <h2 className='mt-4 text-xl md:text-2xl'>{storedProvincesHistories[historyNavIndex]}</h2>
            <GameHistoryComponent 
              data={gameHistory}
            />
          </>
        ) : (
          <span className="italic font-medium text-gray-500">Belum ada riwayat bermain...</span>
        )}
      </div>
    </section>
  )
}