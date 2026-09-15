
import { useProfile } from "@src/store/store";
import ProfileCard from '@components/cards/profileCard';
import Profile from '@components/profile/profile';

const Contents = () =>{
  const formType =  useProfile((state:any) => state.formType);
  
  if(formType === 'update-profile'){
    return  <>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Sign-In`}</title>
      <h1 className='header-4 '>UPDATE PROFILE</h1>
      <div className='divider-horizontal'></div>
      <Profile/>
    </>
  }
  if(formType === 'dashboard'){
    return  <>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Dashboard`}</title>
      <div className='contents'>
      <ProfileCard/>
      </div>
    </>
  }
}

export default Contents;