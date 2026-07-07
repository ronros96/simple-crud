import type { ReactNode } from 'react';
import './popup.css'
import clsx from 'clsx';

import { usePopUp } from "@src/store/store";
import {motion} from 'motion/react';
import { popUpVar, transition } from '@src/variants/animation';

interface PopUpProps {
  className?: any | any[];
  children?: ReactNode | ReactNode[];
  position?: {top:string | number,left:string | number};
}

const PopUp = ({ className, children }: PopUpProps) =>{
  const popHover = usePopUp((state:any) => state.isHover);

  return(
    <motion.span
      variants={popUpVar}
      transition={transition}
      className={clsx('pop-up',{className},{'pop':popHover})}
    >
      {children}
    </motion.span>
  )
}
export default PopUp;