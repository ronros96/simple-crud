import './cards.css';
import { useEffect, useState } from 'react';
import { useProfile } from "@src/store/store";
import { 
  Field,
  FieldGroup,
  FieldLabel 
} from "@components/ui/field";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { profileIcon } from "@lib/helpers/user";

const ProfileCard = () =>{
  const Users = useProfile((state:any) => state.Users);
  const [selected, setSelected] = useState<{ id: string; value: boolean }[]>([]);

  const isSelected = (id: string) => {
    return selected.find((item) => item.id === id)?.value ?? false;
  };

  const handleSelect = (id: string, value: boolean) => {
    setSelected((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, value }
          : item
      )
    );
  };

  const checkAll = (value: boolean) => {
    setSelected((prev) =>
      prev.map((item) => ({
        ...item,
        value,
      }))
    );
  };

  const hasSelected = selected.some((item) => item.value === true);

  useEffect(() => {
    const userVal = Users && Users?.map((user:any) => ({
      id: `${user.id}-${user.username}`,
      value: false,
    }));
    setSelected(userVal);
  }, [Users]);


  return (<>
    <FieldGroup className="flex flex-row w-full mb-[var(--gap)] justify-between">
      <Field orientation="horizontal" className='w-auto select-all'>
        <Checkbox 
          id="profile-check-all" 
          className="profile-check-all"
          checked={selected.every((item) => item.value)}
          onCheckedChange={(checked) => checkAll(checked === true)}
        />
        <FieldLabel htmlFor="profile-check-all">
          Select All
        </FieldLabel>
      </Field>
      <Field orientation="horizontal" className='w-auto'>
        <Button className='delete' disabled={!hasSelected}>
          Delete Selected
        </Button>
      </Field>
    </FieldGroup>

    <div className='grid grid-cols-3 gap-[var(--gap)]'>
    {selected && Users?.map((user:any)=>{
      return <div
        className='profile-card'
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
        <h4 className='header-5'>
          {profileIcon(user.firstname,user.lastname)}
          {user.firstname}{' '}{user.lastname}
        </h4>
        <div className='contents'>
          <p><strong>Mobile</strong></p>
          <p>{user.mobile}</p>
          <p><strong>Email</strong></p>
          <p>{user.email}</p>
          <p><strong>Address</strong></p>
          <p>{user.address}</p>
        </div>
      </div>
    })}
    </div>
  </>)

}
export default ProfileCard;