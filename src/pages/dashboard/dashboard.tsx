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
  const notifShown = useRef(false);
  const userAction = useUserAction((state:any) => state.userAction);
  const setUserAction = useUserAction((state:any) => state.setUserAction);
  const selected = useUser((state:any) => state.selected);
  const {data: userFound} = useGetUser({id:userAction.status === 'update' ? userAction.userID : null});

  const clearUserAction = () => {
     setUserAction({
      status:'',
      userID:'',
      firstname: '',
      lastname: '',
    });
  }

  const showUpdateNotif = (message:string) => {
    toast.add({
      type: "success",
      description: <><strong>{message}</strong><br/>has been successfully updated.</>,
    });
    clearUserAction();
  }

  const showDeleteNotif = (message:string) => {
    toast.add({
      type: "info",
      description: <><strong>{message}</strong><br/>has been successfully deleted.</>,
    });
    notifShown.current = false;
    clearUserAction();
  }

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

  useEffect(() => {
    console.log(userAction,notifShown.current)
    if (userAction.status === 'update' && userFound){
      const msg = `${userFound.firstname} ${userFound.lastname}`;
      showUpdateNotif(msg);
    }
    if (userAction.status === 'delete' && !notifShown.current){
      const msg = `${userAction.firstname} ${userAction.lastname}`;
      showDeleteNotif(msg);
      notifShown.current = true;
    }
  }, [userAction,userFound,notifShown.current]);

  return (
    <section className='container header-margin transparent w-full'>
      {allUsers && isLogged  && <Contents/>}
      <Toaster/>
    </section>
  )
    
}
export default Dashboard;