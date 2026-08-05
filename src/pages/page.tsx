import './page.css';
import Login from '@components/login/login';
import { useLogin, useProfile } from "@src/store/store";

import Profile from '@src/components/profile/profile';

const Page = () =>{

  const isLogged =  useLogin((state:any) => state.isLogged);
  const isSignedIn =  useProfile((state:any) => state.isSignedIn);

  return(
    <section className='container'>
      {
        !isLogged ? (
          !isSignedIn ? (
            <>
              <h1 className='header-4'>User Login</h1>
              <div className='divider-horizontal'></div>
              <Login/>
            </>
          ) : (
            <>
              <h1 className='header-4'>Sign-in</h1>
              <div className='divider-horizontal'></div>
              <Profile/>
            </>
          )
        ) : (
          <div className='main-container'></div>
        )
      }
       
    </section>
  )
}
export default Page;