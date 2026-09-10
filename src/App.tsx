import './App.css';
import clsx from 'clsx';
import Layout from '@layout/layout';
import { useColorScheme } from './store/store';

function App() {
  const currentScheme =  useColorScheme((state:any) => state.currentScheme);
  return (
    <main className={clsx('flex items-center justify-center flex-col',currentScheme)}>
      <Layout/>
    </main>
  )
}

export default App
