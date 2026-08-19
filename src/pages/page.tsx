import './page.css';
import { useEffect } from 'react';
import Login from '@components/login/login';
import { useLogin, useProfile, } from "@src/store/store";
import { useGetUser, usePutUser } from '@hooks/Profile';
import Profile from '@src/components/profile/profile';


const Page = () =>{
  const setLogin = useLogin((state:any) => state.setLogin);
  const isLogged =  useLogin((state:any) => state.isLogged);
  const username = useLogin((state:any) => state.username);
  const setUsername = useLogin((state:any) => state.setUsername);
  const formType =  useProfile((state:any) => state.formType);
  
  const {data: validUser} = useGetUser(username);

  const loggedOut = () => {
    setLogin(false);
    localStorage.removeItem('setLogged')
  }

  const checkLogged = () =>{
    const isLogged = localStorage.getItem('setLogged') ?? "";
    const loggedObj = isLogged !== "" && JSON.parse(isLogged);
    const now = new Date();
     
    if(loggedObj.username){
      setUsername(loggedObj.username);
      console.log(validUser,username)
      if(validUser){
        const lastLogged = validUser?.logged && new Date(validUser?.logged);
        const timeDiff = lastLogged ? now.getTime() - lastLogged.getTime() : -1;
        const less24Hrs = timeDiff >= 0 && timeDiff <= 24 * 60 * 60 * 1000;
        if(less24Hrs){
          setLogin(true);
        }else{
          loggedOut()
        }
      }
    }else{
      loggedOut()
    }
  }

  useEffect(()=>{
    checkLogged();
  },[validUser])

  return(
    <section className='container'>
      {
        !isLogged ? (
          formType === 'sign-in' ? (
            <>
              <h1 className='header-4'>Sign-in</h1>
              <div className='divider-horizontal'></div>
              <Profile/>
            </>
          ) : (
             <>
              <h1 className='header-4'>Welcome</h1>
              <div className='divider-horizontal'></div>
              <Login/>
            </>
          )
        ) : (
          <div className='main-container'>
            <h1>WELCOME!</h1>
            <button onClick={()=>{setLogin(false)}}>Log out</button>
          </div>
        )
      }
    </section>
  )
}
export default Page;