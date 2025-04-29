import { FC, useState } from "react";
import { GameHistoryItem } from "../utils/gameHistory";
import { GameMode } from "../utils/gameMode";
import AreaList from "./AreaList";
import { motion } from "motion/react"
import useStopwatch from "../utils/useStopwatch";

type GameHistoryComponentProps = {
  /** my-2 flex flex-col w-full gap-2 + className */
  className?: string
  data?: GameHistoryItem[]
  survivalData? : { [key: string]: { 'time': number, 'answeredAreas': {[key: string]: "correct" | "wrong" } } }
}

export const GameHistoryComponent: FC<GameHistoryComponentProps> = ({ className, data, survivalData }) => {

  const stopwatch = useStopwatch()

  const [openListIndex, setOpenListIndex] = useState<number | null>(null);

  /** toggle the answered areas list result in play history */
  const toggleOpenList = (index: number) => {
    setOpenListIndex(openListIndex === index ? null : index);
  };

  return(
    <div className={`my-2 flex flex-col w-full gap-2 ${className}`}>
      {survivalData && Object.keys(survivalData).map((key, index) => (
        <div onClick={() => toggleOpenList(index)} className='border-b w-full text-start py-2 cursor-pointer' key={index}>
          <div className='flex justify-between items-center'>
            <span>
              <p>{key}</p>  
              <p>Hasil: {Object.values(survivalData[key].answeredAreas).filter(v => v === "correct").length}/{Object.values(survivalData[key].answeredAreas).length} {survivalData[key].time !== undefined && `| Waktu: ${stopwatch.timeFormatting(survivalData[key].time)}`}</p>
            </span>
            <motion.span 
              animate={{ rotate: openListIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className='text mr-2'
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
            </motion.span>
          </div>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: openListIndex === index ? "auto" : 0, opacity: openListIndex === index ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-2"
          >
            <AreaList 
              answeredAreas={survivalData[key].answeredAreas}
            />
          </motion.div>
        </div>
      ))}
      {data?.map((item, index) => (
        <div onClick={() => toggleOpenList(index)} className='border-b w-full text-start py-2 cursor-pointer' key={index}>
          <div className='flex justify-between items-center'>
            <span>
              <p>{item.mode === GameMode.Casual ? 'Kasual' : item.mode === GameMode.Mix ? 'Ultimate' : item.mode === GameMode.SuddenDeath ? 'Sudden-Death' : item.mode === GameMode.TimeTrial && 'Time Trial'}</p>
              <p>Hasil: {Object.values(item.result).filter(v => v === "correct").length}/{Object.values(item.result).length} {item.time !== undefined && `| Waktu: ${stopwatch.timeFormatting(item.time)}`}</p>
              <p className='text-sm'>{item.date}</p>
            </span>
            <motion.span 
              animate={{ rotate: openListIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className='text mr-2'
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
            </motion.span>
          </div>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: openListIndex === index ? "auto" : 0, opacity: openListIndex === index ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-2"
          >
            <AreaList 
              answeredAreas={item.result}
            />
          </motion.div>
        </div>
      ))}
    </div>
  )
}