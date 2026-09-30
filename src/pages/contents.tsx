import { Country, State } from "country-state-city";
import { 
  Field,
  FieldGroup,
  FieldLabel 
} from "@components/ui/field";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import SearchBar from '@components/search/search';

import { useProfile, useLogin, useSearch } from "@src/store/store";
import { useGetUsers } from '@hooks/Profile';
import ProfileCard from '@components/cards/profileCard';
import Profile from '@components/profile/profile';
import { useEffect } from "react";

const Contents = () =>{
  const isLogged = useLogin((state:any) => state.isLogged);
  const formType =  useProfile((state:any) => state.formType);
  const setFormType = useProfile((state:any) => state.setFormType);
  const setUsers = useProfile((state:any) => state.setUsers);
  const Users = useProfile((state:any) => state.Users);
  const selected = useProfile((state:any) => state.selected);
  const setSelected = useProfile((state:any) => state.setSelected);
  const searchType = useSearch((state:any) => state.searchType);
  const searchValue = useSearch((state:any) => state.searchValue);
  const {data: allUsers} = useGetUsers();

  const checkAll = (value: boolean) => {
    setSelected((prev:any) =>
      prev.map((item:any) => ({
        ...item,
        value,
      }))
    );
  };

  const hasSelected = selected.some(
    (item:any) => item.value === true
  );

  const fixAddress = (address:string[]) =>{
    const country = Country.getCountryByCode(address[0]);
    const state = State.getStateByCode(address[1]);
    return `${address[3]}, ${address[4]}, ${address[2]}, ${state?.name}, ${country?.name}`;
  }

  const searchUsers = (value:string) => {
    const match = allUsers?.filter((user: any) => {
      const search = value.toLowerCase();
      switch (searchType) {
        case 'name':
          return (
            user.firstname?.toLowerCase().includes(search) ||
            user.lastname?.toLowerCase().includes(search)
          );

        case 'mobile':
          return user.mobile?.includes(value);

        case 'email':
          return user.email?.toLowerCase().includes(search);

        case 'address':
          const Address = fixAddress(user.address);
          return Address.toLowerCase().includes(search);
        default:
          return false;
      }
    });

    if(value !== ''){
      setUsers(match)
    }else{
      setUsers(allUsers) 
    }
  }

  useEffect(()=>{
    searchUsers(searchValue)
  },[searchValue])

  if(isLogged && formType === 'update-profile'){
    return  <>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Sign-In`}</title>
      <h1 className='header-4 '>UPDATE PROFILE</h1>
      <div className='divider-horizontal'></div>
      <Profile/>
    </>
  }
  if(isLogged && formType === 'dashboard'){
    return  <>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Dashboard`}</title>
      <div className='contents'>
      <div className="md:flex items-center w-full justify-between">
        <div className="md:flex gap-[var(--gap)]">
          <h1 className="header-5">Profiles</h1>
        </div>
      </div>
      <FieldGroup className="flex flex-row w-full mb-[var(--gap)] justify-between">
        <Field orientation="horizontal" className='w-auto select-all search-box'>
          <SearchBar/>
          <Checkbox 
            id="profile-check-all" 
            className="profile-check-all"
            checked={selected.every((item:any) => item.value)}
            onCheckedChange={(checked) => checkAll(checked === true)}
          />
          <FieldLabel htmlFor="profile-check-all">
            Select All
          </FieldLabel>
        </Field>
        <Field orientation="horizontal" className='w-auto'>
          <Button onClick={() => setFormType('update-profile')}>
            Create
          </Button>
          <Button className='delete' disabled={!hasSelected}>
            Delete
          </Button>
        </Field>
      </FieldGroup>
      {Users?.length > 0 ? 
      <ProfileCard/>:
      <div className="no-result">No Results</div>
      }
      </div>
    </>
  }
}

export default Contents;