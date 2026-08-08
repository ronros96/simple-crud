import './page.css';
import Login from '@components/login/login';
import { useLogin, useProfile } from "@src/store/store";

import Profile from '@src/components/profile/profile';

const Page = () =>{

  const isLogged =  useLogin((state:any) => state.isLogged);
  const formType =  useProfile((state:any) => state.formType);

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
              <h1 className='header-4'>User Login</h1>
              <div className='divider-horizontal'></div>
              <Login/>
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