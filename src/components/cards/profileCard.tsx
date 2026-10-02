import './cards.css';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useUser } from "@src/store/store";
import { SquarePen } from "lucide-react"
import { Checkbox } from "@components/ui/checkbox";
import { profileIcon } from "@lib/helpers/user";
import { fixAddress } from '@lib/helpers/user';

const ProfileCard = () =>{
  const Users = useUser((state:any) => state.Users);
  const selected = useUser((state:any) => state.selected);
  const setSelected = useUser((state:any) => state.setSelected);
  // const UserPicked = useUser((state:any) => state.UserPicked);
  // const setUserPicked = useUser((state:any) => state.setUserPicked);
  
  const isSelected = (id: string) => {
    return selected.find((item:any) => item.id === id)?.value ?? false;
  };

  const isVisible = (id: string) => {
    return selected.find((item:any) => item.id === id)?.visible ?? false;
  };

  const handleSelect = (id: string, value: boolean) => {
    setSelected((prev:any) =>
      prev.map((item:any) =>
        item.id === id
          ? { ...item, value }
          : item
      )
    );
  };

  // const updateUser = () =>{

  // }

  useEffect(() => {
    const userVal = Users && Users?.map((user:any) => ({
      id: `${user.id}-${user.username}`,
      value: false,
      visible: true,
    }));
    setSelected(userVal);
  }, [Users]);

  return (
  <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-[var(--gap)]'>
    {selected && Users?.map((user:any)=>{
      return <div
        className={clsx('profile-card',{'opacity-50':!isVisible(`${user.id}-${user.username}`) && !isSelected(`${user.id}-${user.username}`) })}
        key={`${user.id}-${user.username}`}
        >
        <Checkbox 
          className='user-checkbox'
          id={`${user.id}-${user.username}`} 
          name={`${user.id}-${user.username}`}
          checked={isSelected(`${user.id}-${user.username}`)}
          onCheckedChange={(checked) =>
            handleSelect(
              `${user.id}-${user.username}`,
              checked === true
            )
          }
          />
        <a
          className='edit-user'
          href='#'
          onClick={()=>{
            alert();
          }}>
          <SquarePen size={'1rem'}/>
        </a>
        <h4 className='header-5' >
          {profileIcon(user.firstname,user.lastname)}
          {user.firstname}{' '}{user.lastname}
        </h4>
        <div className='contents'>
          <p><strong>Mobile</strong></p>
          <p>{user.mobile}</p>
          <p><strong>Email</strong></p>
          <p>{user.email}</p>
          <p><strong>Address</strong></p>
          <p>{fixAddress(user.address)}</p>
        </div>
      </div>
    })}
  </div>)

}
export default ProfileCard;