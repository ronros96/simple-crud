import './header.css';
import { useState } from 'react';
import { useProfile, useLogin } from "@src/store/store";
import { loggedOut } from "@lib/helpers/user";
import ColorScheme from "@components/color_scheme/colorScheme";

import { motion, useScroll, useTransform } from "motion/react"
import { ArrowLeft, SquarePen } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";

const Header = () => {
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 100],
    [
      "linear-gradient(to bottom, #00000000, #00000000)",
      "linear-gradient(to bottom, #000000AA, #00000000)",
    ]
  );

  const [open,setOpen] = useState(false);
  const firstname =  useProfile((state:any) => state.firstname);
  const lastname =  useProfile((state:any) => state.lastname);
  const formType =  useProfile((state:any) => state.formType);
  const setFormType =  useProfile((state:any) => state.setFormType);
  const isLogged =  useLogin((state:any) => state.isLogged);
  const firstletter = ((firstname.toLowerCase().charCodeAt(0) - 96) - (lastname.toLowerCase().charCodeAt(0) - 96)) % 10;
  const colornumber = firstletter === 0 ? 1 : firstletter;
  const pbg = `profile-color-${colornumber}`;
  const showHeader = ['dashboard','update-profile'];

  const nav = (e:any,loc:string) => {
    e.preventDefault;
    setFormType(loc)
  }

  const profileView = (e:any) => {
    e.preventDefault;
    setFormType('update-profile')
  }

  return (
    <motion.header
      style={{
        backgroundImage: background,
      }} 
    >
      {
        showHeader.includes(formType) && isLogged ?
        <div className='header-container'>
          <div className='user-info'>
            {formType === 'update-profile' && 
            <a 
              className='back' 
              href='#'
              onClick={(e)=>{nav(e,'dashboard')}}
            >
              <ArrowLeft size={'1rem'}/>
              Back
            </a>}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger render={
                <button 
                  className={`profile-icon ${pbg}`}
                >{firstname[0]}{lastname[0]}</button>
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
                    <button className='sm stroke' onClick={()=>{loggedOut()}}>Sign Out</button>
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
          {formType === 'sign-in' && 
          <a 
            className='back' 
            href='#'
            onClick={(e)=>{nav(e,'')}}
          >
            <ArrowLeft size={'1rem'}/>
            Back
          </a>}
          <ColorScheme/>
        </div>
      }
    </motion.header>
  )
}
export default Header;