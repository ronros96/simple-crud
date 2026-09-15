import './cards.css';
import { 
  Field,
  FieldGroup,
  FieldLabel 
} from "@components/ui/field";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";

import { useGetUsers } from '@hooks/Profile';
import { profileIcon } from "@lib/helpers/user";

const ProfileCard = () =>{
  const {data: allUsers} = useGetUsers();

  return (<>
    <FieldGroup className="flex flex-row w-full mb-[var(--gap)] justify-between">
      <Field orientation="horizontal" className='w-auto'>
        <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
        <FieldLabel htmlFor="terms-checkbox-basic">
          Select All
        </FieldLabel>
      </Field>
      <Field orientation="horizontal" className='w-auto'>
        <Button className='delete'>
          Delete Selected
        </Button>
      </Field>
    </FieldGroup>

    <div className='grid grid-cols-3 gap-[var(--gap)]'>
    {allUsers?.map((user)=>{
      return <div className='profile-card'>
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