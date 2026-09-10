import './header.css';
import { ArrowLeft } from "lucide-react"
import { motion, useScroll, useTransform } from "motion/react"
import { useProfile, useLogin } from "@src/store/store";
import { loggedOut } from "@lib/helpers/user";
import ColorScheme from "@components/color_scheme/colorScheme";

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

  const firstname =  useProfile((state:any) => state.firstname);
  const lastname =  useProfile((state:any) => state.lastname);
  const formType =  useProfile((state:any) => state.formType);
  const setFormType =  useProfile((state:any) => state.setFormType);
  const isLogged =  useLogin((state:any) => state.isLogged);
  const firstletter = ((firstname.toLowerCase().charCodeAt(0) - 96) - (lastname.toLowerCase().charCodeAt(0) - 96)) % 10;
  const colornumber = firstletter === 0 ? 1 : firstletter;
  const pbg = `profile-color-${colornumber}`;

  const nav = (e:any) => {
    e.preventDefault;
    if( formType === 'sign-in')
      setFormType('')
  }

  return (
    <motion.header
      style={{
        backgroundImage: background,
      }} 
    >
      {
        formType === 'dashboard' && isLogged ?
        <div className='header-container'>
          <div className='user-info'>
            <div className={`profile-icon ${pbg}`}>{firstname[0]}{lastname[0]}</div>
            <h1 className='header-5'>{firstname} {lastname}</h1>
            <button className='sm stroke' onClick={()=>{loggedOut()}}>Sign Out</button>
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
            onClick={nav}
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