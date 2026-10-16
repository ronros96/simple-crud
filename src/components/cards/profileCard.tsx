import './cards.css';
import clsx from 'clsx';
import { useEffect} from 'react';
//type
import type { User } from '@src/fields/type';
//UI
import { Checkbox } from "@components/ui/checkbox";
import { SquarePen } from "lucide-react"
//storage
import { useUser, useProfile, useFilter } from "@src/store/store";
//helpers
import { profileIcon } from "@lib/helpers/user";
import { useRoute } from '@lib/helpers/routes';
import { fixAddress, fixContact } from '@lib/helpers/user';




const ProfileCard = () =>{
  //local state
  //global states
  const Users = useUser((state:any) => state.Users);
  const selected = useUser((state:any) => state.selected);
  const setSelected = useUser((state:any) => state.setSelected);
  const setFormType = useProfile((state:any) => state.setFormType);
  const viewFilter = useFilter((state:any) => state.viewFilter);
  //navigation
  const { toUpdateProfile } = useRoute();

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

  const updateProfile = (e:any,id:any) =>{
    e.preventDefault();
    setFormType('update-user');
    toUpdateProfile(id)
  }

  const filtersCount = Object.entries(viewFilter)
  .filter(([key, value]) => key !== "all" && value)
  .length;

  console.log(filtersCount,viewFilter)

  useEffect(() => {
    const userVal = Users && Users?.map((user:User) => ({
      id: `${user.id}-${user.username}`,
      userID: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      value: false,
      visible: true,
    }));
    setSelected(userVal);
  }, [Users]);

  return (
  <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-[var(--gap)]'>
    {selected && Users?.map((user:any)=>{
      return <div
        className={clsx('profile-card',{'hidden':!isVisible(`${user.id}-${user.username}`) })}
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
          onClick={(e)=>updateProfile(e,user.id)}>
          <SquarePen id={user.id} size={'1rem'}/>
        </a>
        <h4 className='header-5' >
          {profileIcon(user.firstname,user.lastname)}
          {user.firstname}{' '}{user.lastname}
          {user.bot && <span className='bot'>Dummy</span>}
        </h4>
        <div
          className={clsx('contents',{
            'hide':filtersCount === 0,
            'show-1':filtersCount === 1,
            'show-2':filtersCount === 2,
            'show-all':filtersCount === 3,
          })}  
        >
          {viewFilter.contact && <>
            <p><strong>Contact</strong></p>
            <p>{fixContact(user.contact,user.bot ? user.address : undefined).join(' ')}</p>
          </>}
          {viewFilter.email && <>
            <p><strong>Email</strong></p>
            <p>{user.email}</p>
          </>}
          {viewFilter.address && <>
            <p><strong>Address</strong></p>
            <p>{fixAddress(user.address)}</p>
          </>}
        </div>
      </div>
    })}
  </div>)

}
export default ProfileCard;