import './App.css';
import "./index.css";

import clsx from 'clsx';
import Layout from '@layout/layout';
import { useColorScheme } from './store/store';
import { useLogin } from "@src/store/store";

function App() {
  const currentScheme =  useColorScheme((state:any) => state.currentScheme);
  const isLogged =  useLogin((state:any) => state.isLogged);

  return (
    <main className={clsx(
      'flex items-center flex-col',
      currentScheme,
      {'justify-start':isLogged},
      {'justify-center':!isLogged}
    )}>
      <Layout/>
    </main>
  )
}

export default App
