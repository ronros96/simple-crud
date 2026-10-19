import './App.css';

import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router';
import clsx from 'clsx';
//UI
import { 
  OctagonX, 
  X,
  Cookie, 
} from "lucide-react"
import Header from '@layout/header/header';
import Footer from '@layout/footer/footer';
import Preloader from '@components/preloader/preloader';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@components/ui/alert";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@components/ui/item"
import { Button } from "@components/ui/button";
import { Spinner } from "@components/ui/spinner"
//states
import { useColorScheme } from './store/store';
import { useLogin, useProfile } from "@src/store/store";
//helpers
import { useRoute, usePath } from "@lib/helpers/routes";
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

  const [showError, setShowError] = useState({
    errorLogs:false,
    showModal:false
  });
  const [showStatus, setShowStatus] = useState(false);

  const currentScheme = useColorScheme((state: any) => state.currentScheme);
  const isLogged = useLogin((state: any) => state.isLogged);
  const setLogin = useLogin((state: any) => state.setLogin);
  const cookies = useLogin((state: any) => state.cookies);
  const setCookies = useLogin((state: any) => state.setCookies);
  const formType = useProfile((state: any) => state.formType);
  const setFormType = useProfile((state: any) => state.setFormType);
  const userID = useProfile((state: any) => state.id);
  const setProfile = useProfile((state: any) => state.setProfile);
  //navigation
  const { toDashboard, toLogin, toUpdateProfile, toNewProfile, toAbout } = useRoute();
  const cleanPath = usePath();
  const reservedPaths = ['about', 'update', 'register'];
  const { id } = useParams();
  // Check Cookies
  const checkCookies = () => {
  const item = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith('session'))?.split(',')[0];
    return item ? false : true;
  };

  const { data: validUser } = useGetUser({
    id: session && Object(session).map((item: any) => item.UserId)[0] || userID
  });

  useEffect(() => {
    setShowStatus(isPending);
    if (session && validUser || userID !== '') {
      if(!isLogged){
        setLogin(true);
        setProfile({
          id: validUser?.id,
          username: validUser?.username,
          password: validUser?.password,
          firstname: validUser?.firstname,
          lastname: validUser?.lastname,
          contact: validUser?.contact,
          email: validUser?.email,
          address: [validUser?.address],
          terms: true,
        });
      }
      
      if(!reservedPaths.includes(cleanPath)){
        setFormType('dashboard');
        toDashboard();
      }else if(cleanPath === 'update'){
        validUser?.id === id ? setFormType('update-profile') : setFormType('update-user');
        id && toUpdateProfile(id);
      }else if(cleanPath === 'register'){
        setFormType('new-user');
        toNewProfile();
      }else if(cleanPath === 'about'){
        setFormType('about');
        toAbout()
      }
    }else if (session === null) {
      setLogin(false);
      if(cleanPath === 'register'){
        setFormType('sign-in');
        toNewProfile();
      }else{
        setProfile({})
        setFormType('login');
        toLogin()
      }
    }
  }, [session, validUser, isLogged, userID]);

  useEffect(() => {
    if (isError && !showError.errorLogs) {
      setShowError({
        errorLogs:true,
        showModal:true
      });
      setTimeout(() => {
        setShowError((prev) => ({ ...prev, showModal:false }));
      }, 5300)
    }
  }, [showError.errorLogs, isError]);

  useEffect(()=>{
    cookies === "idle" && setCookies(checkCookies() ? "idle":"yes");
  },[cookies]);

  return (
    <>
      <Preloader />
      <Header />

      <Item variant="outline" className={clsx({ 'show': cookies === "idle" })}>
        <ItemContent>
          <ItemTitle>
            <Cookie/>
            Cookie Notice
          </ItemTitle>
          <ItemDescription className='mb-0'>
            This site uses a cookie to keep you logged in. It expires after 24 hours of inactivity.<br className='hidden md:inline'/> No other information is collected through cookies.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button 
            className="stroke sm"
            onClick={()=>{setCookies('yes')}}>
            Got It
          </Button>
        </ItemActions>
      </Item>

      <Alert className={clsx({ 'show': showStatus })}>
        <Spinner/>
        <AlertTitle>Verifiying Session </AlertTitle>
        <AlertDescription>
          Please wait, while system is verifitying your session.
        </AlertDescription>
      </Alert>

      <Alert className={clsx({ 'show': showError.showModal })}>
        <OctagonX className='error' />
        <AlertTitle>Session Error</AlertTitle>
        <AlertDescription>
          Unable to verify your session.
        </AlertDescription>
        <Button className="icon cooldown-close" onClick={() => {
          setShowError((prev) => ({ ...prev, showModal:false }));
        }}><X /></Button>
      </Alert>

      <main className={clsx(
        'flex items-center flex-col',
        currentScheme,
        { 'justify-start': isLogged && formType !== 'success' },
        { 'justify-center': !isLogged || formType === 'success' }
      )}>
        <div className="page-content w-full flex flex-col items-center">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default App
