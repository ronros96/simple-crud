import './header.css';
import { 
  LogOutIcon,
  UserPen,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";

import { useProfile, useLogin } from "@src/store/store";
import { loggedOut, profileIcon } from "@lib/helpers/user";
import ColorScheme from "@components/color_scheme/colorScheme";

import { motion, useScroll, useTransform } from "motion/react"
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

  
  const firstname =  useProfile((state:any) => state.firstname);
  const lastname =  useProfile((state:any) => state.lastname);
  const formType =  useProfile((state:any) => state.formType);
  const setFormType =  useProfile((state:any) => state.setFormType);
  const isLogged =  useLogin((state:any) => state.isLogged);
  const showHeader = [
    'dashboard',
    'update-profile',
    'new-user'
  ];
  const showBackCancel = [
    'update-profile',
    'new-user'
  ]

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
            {showBackCancel.includes(formType) && <BackCancel type='header'/>}
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button className='icon'>
                {profileIcon(firstname,lastname)}
              </Button>
              } />
              <DropdownMenuContent align="end" className='dropmenu'>
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    onClick={(e:any)=>{
                      profileView(e)
                    }}
                  >
                    <UserPen />
                    Account
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={()=>{
                    loggedOut()
                  }}
                >
                  <LogOutIcon />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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