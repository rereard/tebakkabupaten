import { motion } from "motion/react"
import { FC, ReactNode } from "react";
import Button from "./Button";
import Spinner from "./Spinner";

type ModalContainerProps = {
  children: ReactNode;
  isOpen: boolean;
  leftButtonTitle?: string;
  leftButtonFunction?: () => void;
  leftButtonDisabled?: boolean;
  rightButtonTitle?: string;
  rightButtonFunction?: () => void;
  rightButtonDisabled?: boolean;
  rbLoading?: boolean
}

const ModalContainer: FC<ModalContainerProps> = ({ children, isOpen, leftButtonTitle, leftButtonFunction, leftButtonDisabled, rightButtonTitle, rightButtonFunction, rightButtonDisabled, rbLoading }) => {
  return(
    <div className={`${!isOpen && 'hidden'} absolute bg-black/40 bg-op z-[9999] top-0 w-full h-screen flex justify-center items-center`}>
      <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y:0 }} transition={{ duration: 0.3, ease: "easeOut" }} className='bg-white flex flex-col items-center p-6 rounded-lg shadow-xl w-fit lg:max-w-2/5 border-4 relative'>
        {children}
        <div className='text-white w-11/12 flex gap-2 justify-between'>
          <Button
            disabled={leftButtonDisabled} 
            title={leftButtonTitle!}
            onClick={leftButtonFunction}
          />
          {rbLoading ? (
            <div className="w-[120px]">
              <Spinner mini={true} />
            </div>
          ) : (
            <Button
              disabled={rightButtonDisabled} 
              title={rightButtonTitle!}
              onClick={rightButtonFunction}
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ModalContainer