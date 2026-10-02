import './App.css';

import { useEffect } from 'react';
import clsx from 'clsx';
import { Outlet, useLocation  } from 'react-router';

import { useColorScheme } from './store/store';
import { useLogin } from "@src/store/store";

import { useRoute } from "@lib/helpers/routes";
import { checkLogged } from "@lib/helpers/user";

import { useGetUser } from '@hooks/Profile';
import Header from '@layout/header/header';
import Footer from '@layout/footer/footer';
import Preloader from '@components/preloader/preloader';

function App() {
  const currentScheme =  useColorScheme((state:any) => state.currentScheme);
  const isLogged =  useLogin((state:any) => state.isLogged);
  const id = useLogin((state:any) => state.id);
  const username = useLogin((state:any) => state.username);
  const {data: validUser} = useGetUser({id:id,username:username});
  //navigation
  const { toDashboard, toLogin } = useRoute();

  useEffect(()=>{
    checkLogged(validUser);
    if(isLogged){
      if(location.pathname !== '/simple-crud/'){
        toDashboard();
      }
    }else{
      toLogin()
    }
  },[isLogged,validUser]);

  return (
    <>
      <Header/>
      <main className={clsx(
        'flex items-center flex-col',
        currentScheme,
        {'justify-start':isLogged},
        {'justify-center':!isLogged}
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
