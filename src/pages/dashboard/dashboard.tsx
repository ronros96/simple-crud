import { useGetUsers } from '@hooks/Profile';
import Contents from '../contents/contents';
import { useLogin } from "@src/store/store";


const Dashboard = () =>{
  //hooks
  const {data: allUsers} = useGetUsers();
  const isLogged =  useLogin((state:any) => state.isLogged);

  return (
    <section className='container header-margin transparent w-full'>
      {allUsers && isLogged  && <Contents/>}
    </section>
  )
  
}
export default Dashboard;