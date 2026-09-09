import Page from '@page/page';
import Header from './header/header';
import {useLogin, useProfile} from "@src/store/store";

const Layout = () =>{

  const formType =  useProfile((state:any) => state.formType);
  const isLogged =  useLogin((state:any) => state.isLogged);

  return(
    <>
      {formType === 'dashboard' && isLogged && <Header/>}
      <Page/>
    </>
  )
}
export default Layout;