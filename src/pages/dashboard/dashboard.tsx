import { useEffect, useRef } from 'react';
//UI
import { toast, Toaster } from "@components/ui/toast";
//Hooks
import { useGetUsers, useGetUser } from '@hooks/Profile';
//Global States
import { useLogin, useUserUpdated } from "@src/store/store";
//UI

import Contents from '../contents/contents';



const Dashboard = () =>{
  //hooks
  const {data: allUsers} = useGetUsers();
  const isLogged =  useLogin((state:any) => state.isLogged);
  
  //notify
  const notifiedUserID = useRef<string | null>(null);
  const profileUpdate = useUserUpdated((state:any) => state.profileUpdate);
  const updatedUserID = useUserUpdated((state:any) => state.updatedUserID);
  const setProfileUpdate = useUserUpdated((state:any) => state.setProfileUpdate);
  const setUpdatedUserID = useUserUpdated((state:any) => state.setUpdatedUserID);
  const {data: userFound} = useGetUser({id:updatedUserID});

  const showToastNotif = (message:string) => {
    const notif = toast.add({
      title: "Success",
      description: <><strong>{message}</strong>,<br/>has been successfully updated.</>,
      actionProps: {
        children: "Ok",
        onClick() {
          toast.close(notif)
        },
      },
    })
  }

 useEffect(() => {
  if (!profileUpdate || !updatedUserID || !userFound) return;
  if (notifiedUserID.current === updatedUserID) return;
  notifiedUserID.current = updatedUserID;
  const msg = `${userFound.firstname} ${userFound.lastname}`;
  showToastNotif(msg);
  setProfileUpdate(false);
  setUpdatedUserID('');
}, [
  profileUpdate,
  updatedUserID,
  userFound,
  setProfileUpdate,
  setUpdatedUserID,
]);

  return (
    <section className='container header-margin transparent w-full'>
      {allUsers && isLogged  && <Contents/>}
      <Toaster/>
    </section>
  )
  
}
export default Dashboard;