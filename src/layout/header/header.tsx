import './header.css';
import { useProfile } from "@src/store/store";
import { loggedOut } from "@lib/helpers/user";

const Header = () => {
  const firstname =  useProfile((state:any) => state.firstname);
  const lastname =  useProfile((state:any) => state.lastname);
  const firstletter = ((firstname.toLowerCase().charCodeAt(0) - 96) - (lastname.toLowerCase().charCodeAt(0) - 96)) % 10;
  const colornumber = firstletter === 0 ? 1 : firstletter;
  const pbg = `profile-color-${colornumber}`;

  return (
    <header>
      <div className='user-info'>
        <div className={`profile-icon ${pbg}`}>{firstname[0]}{lastname[0]}</div>
        <h1 className='header-5'>{firstname} {lastname}</h1>
        <button className='sm stroke' onClick={()=>{loggedOut()}}>Sign Out</button>
      </div>
      <div className='theme'>
        THEME
      </div>
     
    </header>
  )
}
export default Header;