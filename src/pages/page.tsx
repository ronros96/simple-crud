import './page.css';
import Login from '@components/login/login';
import { useLogin, useSignIn } from "@src/store/store";

import SignIn from '@components/sign-in/sign-in';

const Page = () =>{

  const isLogged =  useLogin((state:any) => state.isLogged);
  const isSignedIn =  useSignIn((state:any) => state.isSignedIn);

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
              <SignIn/>
            </>
          )
        ) : (
          <>
          <aside className='aside-container'></aside>
          <div className='main-container'></div>
          </> 
        )
      }
       
    </section>
  )
}
export default Page;