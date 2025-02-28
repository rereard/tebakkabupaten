import { motion } from "motion/react"

type ButtonProps = {
  onClick?: () => void;
  /** customize button width, default is 128px */
  width?: number;
  /** use classname to set button position (e.g., top, bottom, right, left) in tailwind */
  className?: string;
  /** motion initial animation */
  initial?: Record<string, any>;
  /** motion animate to */
  animate?: Record<string, any>;
  /** motion exit animation */
  exit?: Record<string, any>;
  /** motion animation transition */
  transition?: Record<string, any>;
  title: string;
  /** customize button z-index, default is undefined */
  zIndex?: number;
  /** customize button css position, default is undefined */
  position?: PositionType
  /** change button disabled, default false */
  disabled?: boolean
}

type PositionType = "absolute" | "relative" | "fixed" | "static" | "sticky";

export default function Button({ onClick, width = 128, className, animate, exit, transition, initial, title, zIndex = undefined, position = undefined, disabled = false }: ButtonProps){
  return(
    <motion.button
      disabled={disabled}
      whileHover={disabled ? {} : { backgroundColor: '#155dfc', scale: 1.05 }}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      onClick={onClick}
      style={{ width, zIndex, position }}
      className={`bg-[#2b7fff] text-white p-2 outline-2 outline-blue-950 rounded-lg border-slate-400 shadow-lg cursor-pointer ${className}`}
    >
      {title}
    </motion.button>
  )
}