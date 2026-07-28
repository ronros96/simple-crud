import './page.css';
import Login from '@components/login/login';

import { useLogin } from "@src/store/store";

const Page = () =>{
  const isLogged =  useLogin((state:any) => state.isLogged);


  return(
    <section className='container w-full'>
      {
        !isLogged ? (
          <>
            <h1 className='header-3 text-center'>User Login</h1>
            <Login/>
          </>
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