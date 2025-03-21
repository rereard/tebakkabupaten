import { FC, useState } from "react";
import { GameHistoryItem } from "../utils/gameHistory";
import { GameMode } from "../utils/gameMode";
import AreaList from "./AreaList";
import { motion } from "motion/react"
import useStopwatch from "../utils/useStopwatch";

type GameHistoryComponentProps = {
  /** my-2 flex flex-col w-full gap-2 + className */
  className?: string
  data: GameHistoryItem[]
}

export const GameHistoryComponent: FC<GameHistoryComponentProps> = ({ className, data }) => {

  const stopwatch = useStopwatch()

  const [openListIndex, setOpenListIndex] = useState<number | null>(null);

  /** toggle the answered areas list result in play history */
  const toggleOpenList = (index: number) => {
    setOpenListIndex(openListIndex === index ? null : index);
  };

  return(
    <div className={`my-2 flex flex-col w-full gap-2 ${className}`}>
      {data.map((item, index) => (
        <div onClick={() => toggleOpenList(index)} className='border-b w-full text-start py-2 cursor-pointer' key={index}>
        <div className='flex justify-between items-center'>
          <span>
            <p>{item.mode === GameMode.Casual ? 'Kasual' : item.mode === GameMode.Mix ? 'Ultimate' : item.mode === GameMode.SuddenDeath ? 'Sudden-Death' : item.mode === GameMode.TimeTrial && 'Time Trial'}</p>
            <p>Hasil: {Object.values(item.result).filter(v => v === "correct").length}/{Object.values(item.result).length} {item.time && `| Waktu: ${stopwatch.timeFormatting(item.time)}`}</p>
            <p className='text-sm'>{item.date}</p>
          </span>
          <motion.span 
            animate={{ rotate: openListIndex === index ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className='text mr-2'
          >
            ⮟
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