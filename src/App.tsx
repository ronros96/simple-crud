import './App.css';

import { useEffect } from 'react';
import { Outlet } from 'react-router';
import clsx from 'clsx';
//UI
import Header from '@layout/header/header';
import Footer from '@layout/footer/footer';
import Preloader from '@components/preloader/preloader';
//states
import { useColorScheme } from './store/store';
import { useLogin,useProfile } from "@src/store/store";
//helpers
import { useRoute } from "@lib/helpers/routes";
//Hooks
import { useRestoreAuthSession } from '@hooks/logs';
import { useGetUser } from '@hooks/Profile';

function App() {
  //hooks
  const {
    data: session,
    isPending,
    isError,
  } = useRestoreAuthSession();
  const {data: validUser} = useGetUser({
    id:session && Object(session).map((item:any) => item.UserId)[0]
  });

  const currentScheme =  useColorScheme((state:any) => state.currentScheme);
  const isLogged = useLogin((state:any) => state.isLogged);
  const setLogin = useLogin((state:any) => state.setLogin);
  const formType = useProfile((state:any) => state.formType);
  const setFormType = useProfile((state:any) => state.setFormType);
  const setProfile = useProfile((state:any) => state.setProfile);
  //navigation
  const { toDashboard, toLogin } = useRoute();
   
  useEffect(()=>{
    if(session && validUser) {
      if(!isLogged){
        setLogin(true);
        setProfile({
          id:validUser.id,
          username: validUser.username,
          password: validUser.password,
          firstname: validUser.firstname,
          lastname: validUser.lastname,
          contact: validUser.contact,
          email: validUser.email,
          address: [validUser.address],
          terms: true,
        })
        setFormType('dashboard');
        toDashboard();
      }
    }else{
      setLogin(false);
      setProfile({})
      setFormType('login');
      toLogin()
    }
  },[session,validUser]);

  if (isPending) {
    return <div className='status'>Checking session...</div>;
  }

  if (isError) {
    return <div className='status'>Unable to verify session. Please try again.</div>;
  }

  return (
    <>
      <Header/>
      <main className={clsx(
        'flex items-center flex-col',
        currentScheme,
        {'justify-start':isLogged && formType !== 'success'},
        {'justify-center':!isLogged || formType === 'success'}
      )}>
        <Preloader/>
        <div className="page-content w-full flex flex-col items-center">
          <Outlet />
        </div>
      </main>
      <Footer/>
    </>
  )

}

export default App
