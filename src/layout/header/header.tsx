import './header.css';
import { useState } from 'react';
import { useProfile, useLogin } from "@src/store/store";
import { loggedOut, profileIcon } from "@lib/helpers/user";
import ColorScheme from "@components/color_scheme/colorScheme";

import { motion, useScroll, useTransform } from "motion/react"
import { SquarePen } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import BackCancel from '@components/back_cancel/backCancel';

const Header = () => {
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 100],
    [
      "#00000000",
      "#000000FF",
    ]
  );

  const [open,setOpen] = useState(false);
  const firstname =  useProfile((state:any) => state.firstname);
  const lastname =  useProfile((state:any) => state.lastname);
  const formType =  useProfile((state:any) => state.formType);
  const setFormType =  useProfile((state:any) => state.setFormType);
  const isLogged =  useLogin((state:any) => state.isLogged);
  const showHeader = ['dashboard','update-profile'];

  const profileView = (e:any) => {
    e.preventDefault;
    setFormType('update-profile')
  }

  return (
    <motion.header
      style={{
        background: background,
      }} 
    >
      {
        showHeader.includes(formType) && isLogged ?
        <div className='header-container'>
          <div className='user-info'>
            {formType === 'update-profile' && <BackCancel type='header'/>}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger render={
                <button>
                  {profileIcon(firstname,lastname)}
                </button>
              } />
              <PopoverContent>
                <div className='popover-user-info'>
                  <div className='profile'>
                    <h2 className='header-5'>
                      {firstname}{' '}{lastname}
                      <a 
                        href='#'
                        onClick={(e:any)=>{
                          profileView(e)
                          setOpen(false)
                        }}>
                        <SquarePen size={'.8rem'}/>
                      </a>
                      <br/>
                    </h2>
                  </div>
                  <div className='bottom'>
                    <button 
                      className='sm stroke m-auto' 
                      onClick={()=>{
                        setOpen(false);
                        loggedOut()
                      }}
                    >Sign Out</button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className='theme'>
            <ColorScheme/>
          </div>
        </div> :
        <div className='header-container'>
          {formType === 'sign-in' && <BackCancel type='header'/>}
          <ColorScheme/>
        </div>
      }
    </motion.header>
  )
}
export default Header;