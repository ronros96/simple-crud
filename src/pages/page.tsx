import './page.css';
import { useEffect, useState } from 'react';
import Login from '@components/login/login';
import { useLogin, useProfile } from "@src/store/store";
import { checkLogged } from "@lib/helpers/user";
import { useGetUser } from '@hooks/Profile';
import Profile from '@src/components/profile/profile';


const Page = () =>{
  const isLogged =  useLogin((state:any) => state.isLogged);
  const username = useLogin((state:any) => state.username);
  const formType =  useProfile((state:any) => state.formType);
  const {data: validUser} = useGetUser(username);

  useEffect(()=>{
    
  })

  useEffect(()=>{
    checkLogged(validUser);
  },[validUser]);

  return(
    <section className='container'>
      {
        !isLogged ? (
          formType === 'sign-in' ? (
            <>
              <title>{`${import.meta.env.VITE_APP_TITLE} | Sign-In`}</title>
              <h1 className='header-4'>Sign-in</h1>
              <div className='divider-horizontal'></div>
              <Profile/>
            </>
          ) : (
             <>
              <title>{`${import.meta.env.VITE_APP_TITLE} | Log-in`}</title>
              <h1 className='header-4'>Welcome</h1>
              <div className='divider-horizontal'></div>
              <Login/>
            </>
          )
        ) : (
          <>
            <title>{`${import.meta.env.VITE_APP_TITLE} | Dashboard`}</title>
            <div className='main-container'>

            </div>
          </> 
        )
      }
    </section>
  )
}
export default Page;