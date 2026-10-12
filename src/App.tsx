import './App.css';

import { useEffect } from 'react';
import clsx from 'clsx';
import { Outlet } from 'react-router';

import { useColorScheme } from './store/store';
import { useLogin,useProfile } from "@src/store/store";

import { useRoute } from "@lib/helpers/routes";
import { loggedOut } from "@lib/helpers/user";

import { useGetUser } from '@hooks/Profile';
import Header from '@layout/header/header';
import Footer from '@layout/footer/footer';
import Preloader from '@components/preloader/preloader';

function App() {
  const currentScheme =  useColorScheme((state:any) => state.currentScheme);
  const isLogged = useLogin((state:any) => state.isLogged);
  const setLogin = useLogin((state:any) => state.setLogin);
  const setUsername = useLogin((state:any) => state.setUsername);
  const setFormType = useProfile((state:any) => state.setFormType);
  const localLogged = localStorage.getItem('setLogged') ?? "";
  const loggedObj = localLogged !== "" && JSON.parse(localLogged);
  const {data: validUser} = useGetUser({id:loggedObj.id,});
  //navigation
  const { toDashboard, toLogin } = useRoute();

  const checkLogged = () =>{
    const now = new Date();
    if(validUser){
      const lastLogged = validUser.logged && new Date(validUser.logged);
      const timeDiff = lastLogged ? now.getTime() - lastLogged.getTime() : -1;
      const less24Hrs = timeDiff >= 0 && timeDiff <= 24 * 60 * 60 * 1000;
      if(less24Hrs){
        useProfile.setState({
          formType:'dashboard',
          id:validUser.id,
          username: validUser.username,
          password: validUser.password,
          firstname: validUser.firstname,
          lastname: validUser.lastname,
          contact: validUser.contact,
          email: validUser.email,
          address: [validUser.address],
          terms: true,
        });
        setUsername({
          id:validUser.id,
          username:validUser.username
        })
        setLogin(true)
      }else{
        loggedOut();
      }
    }
  }

  useEffect(()=>{
    checkLogged()
    if(isLogged){
      setFormType('dashboard');
      toDashboard();
    }else{
      setFormType('login');
      toLogin()
    }
    //console.log(isLogged,formType);
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
