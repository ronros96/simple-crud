import './colorscheme.css';
import clsx from 'clsx';
import { useColorScheme } from "@src/store/store";
import { Switch } from "@components/ui/switch";

const colorScheme = () => {
  const setFormType = useColorScheme((state:any) => state.setCurrentScheme);
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setFormType(isDark ? 'dark' : 'light');
  
  return <Switch 
    className={clsx('color-scheme-toggle')}
    onCheckedChange={(val)=>{
      setFormType(!val ? 'dark' : 'light');
    }}
    defaultChecked={!isDark}
  />
}
export default colorScheme;