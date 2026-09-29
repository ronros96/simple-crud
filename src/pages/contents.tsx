
import { useEffect } from "react";
import { useProfile, useLogin } from "@src/store/store";
import { useGetUsers } from '@hooks/Profile';
import ProfileCard from '@components/cards/profileCard';
import Profile from '@components/profile/profile';

const Contents = () =>{
  const isLogged = useLogin((state:any) => state.isLogged);
  const formType =  useProfile((state:any) => state.formType);
  const setUsers = useProfile((state:any) => state.setUsers);
  const Users = useProfile((state:any) => state.Users);
  const {data: allUsers} = useGetUsers();

  useEffect(()=>{
    isLogged && setUsers(allUsers);
  },[Users])
  
  if(isLogged && formType === 'update-profile'){
    return  <>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Sign-In`}</title>
      <h1 className='header-4 '>UPDATE PROFILE</h1>
      <div className='divider-horizontal'></div>
      <Profile/>
    </>
  }
  if(isLogged && formType === 'dashboard'){
    return  <>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Dashboard`}</title>
      <div className='contents'>
      <div className="md:flex items-center w-full justify-between">
        <div className="md:flex gap-[var(--gap)]">
          <h1 className="header-5">Profiles</h1>
        </div>
      </div>
      {Users?.length > 0 && <ProfileCard/>}
      </div>
    </>
  }
}

export default Contents;