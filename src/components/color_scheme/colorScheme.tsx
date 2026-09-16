import './colorscheme.css';
import clsx from 'clsx';
import { useColorScheme } from "@src/store/store";
import { Switch } from "@components/ui/switch";
import { useEffect } from 'react';

const colorScheme = () => {
  const currentScheme = useColorScheme((state:any) => state.currentScheme);
  const setCurrentScheme = useColorScheme((state:any) => state.setCurrentScheme);
  const isDark = currentScheme !== '' ? currentScheme === 'dark' ? true : false : window.matchMedia('(prefers-color-scheme: dark)').matches;
  useEffect(()=>{
     setCurrentScheme(isDark ? 'dark' : 'light');
  },[currentScheme])
  
  return <Switch 
    className={clsx('color-scheme-toggle')}
    onCheckedChange={(val)=>{
      setCurrentScheme(!val ? 'dark' : 'light');
    }}
    checked={!isDark}
  />
}
export default colorScheme;