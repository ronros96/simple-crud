import { useNavigate } from 'react-router';
import { useLogin } from "@src/store/store";
import { useGetUsers } from '@hooks/Profile';
import Contents from './contents/contents';
import { useEffect } from 'react';

const Dashboard = () =>{
  const isLogged =  useLogin((state:any) => state.isLogged);
  const {data: allUsers} = useGetUsers();
  const navigate = useNavigate();
  
  useEffect(()=>{
    if(!isLogged || !allUsers){
      navigate('/');
    }
  },[allUsers])

  return (
    <section className='container header-margin transparent w-full'>
      {allUsers && <Contents/>}
    </section>
  )
  
}
export default Dashboard;