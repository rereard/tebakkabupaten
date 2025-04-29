import { motion } from "framer-motion";

export default function Spinner({mini}: {mini?: boolean}) {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <motion.div
        className={`${mini ? "w-8 h-8 border-4" : "w-12 h-12 border-8 my-5"} border-t-transparent border-blue-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}
