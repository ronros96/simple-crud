import { useEffect, useRef } from 'react';
//UI
import { toast, Toaster } from "@components/ui/toast";
//Hooks
import { useGetUsers, useGetUser } from '@hooks/Profile';
//Global States
import { useLogin, useUserAction, useUser } from "@src/store/store";
//contents
import Contents from '../contents/contents';

const Dashboard = () =>{
  //hooks
  const {data: allUsers} = useGetUsers();
  const isLogged =  useLogin((state:any) => state.isLogged);
  //notify
  const selected = useUser((state:any) => state.selected);

  const showToastMax = () => {
    toast.add({
      type: "success",
      description: <><strong>Max profile selection reached</strong></>,
    });
  }

  const selectedCount: number = selected.filter(
    (item: any) => item.value
  ).length;

  useEffect(() => {
    selectedCount > 14 && showToastMax();
  },[selectedCount]);

  return (
    <section className='container header-margin transparent w-full'>
      {allUsers && isLogged  && <Contents/>}
    </section>
  )
}
export default Dashboard;