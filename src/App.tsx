import './App.css';
import "./index.css";

import clsx from 'clsx';
import { Outlet } from 'react-router';
import Header from '@layout/header/header';
import Footer from '@layout/footer/footer';
import { useColorScheme } from './store/store';
import { useLogin } from "@src/store/store";

function App() {
  const currentScheme =  useColorScheme((state:any) => state.currentScheme);
  const isLogged =  useLogin((state:any) => state.isLogged);

  return (
    <>
      <Header/>
      <main className={clsx(
        'flex items-center flex-col',
        currentScheme,
        {'justify-start':isLogged},
        {'justify-center':!isLogged}
      )}>
        <Outlet />
      </main>
      <Footer/>
    </>
  )

}

export default App
