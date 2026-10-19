import { useEffect, useMemo, useState } from "react";
//TS types
import {
  CircleX,
  UserCheck,
  UserRoundPlus,
  View,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import SearchBar from '@components/search/search';
import DeleteUser from "@components/delete_user/deleteUser";
//storage
import { useProfile, useUser, useSearch, useFilter, useDelete } from "@src/store/store";
import { useGetUsers } from '@hooks/Profile';
import ProfileCard from '@components/cards/profileCard';
//helpers
import { clearUser, fixAddress } from '@lib/helpers/user';
import { useRoute } from '@lib/helpers/routes';
import { profileIcon } from "@lib/helpers/user";

const Contents = () =>{
  //global states
  const userID = useProfile((state:any) => state.id);
  const username = useProfile((state:any) => state.username);
  const setFormType = useProfile((state:any) => state.setFormType);
  const selected = useUser((state:any) => state.selected);
  const setSelected = useUser((state:any) => state.setSelected);
  const setUsers = useUser((state:any) => state.setUsers);
  const Users = useUser((state:any) => state.Users);
  const searchType = useSearch((state:any) => state.searchType);
  const searchValue = useSearch((state:any) => state.searchValue);
  const viewFilter = useFilter((state:any) => state.viewFilter);
  const setViewFilter = useFilter((state:any) => state.setViewFilter);
  const complete = useDelete((state:any) => state.complete);
  
  //hooks
  const {data: allUsers, refetch} = useGetUsers();
  //navigation
  const { toNewProfile } = useRoute();

  const users = useMemo(
    () => allUsers?.filter((user) => !(user.id === userID)) ?? [],
    [allUsers, userID, username]
  );

  const checkAll = (value: boolean) => {
    setSelected((prev:any) =>
      prev.map((item:any) => ({
        ...item,
        value
      }))
    );
  };

  const hasSelected = selected.some(
    (item:any) => item.value === true
  );

  const selectedCount: number = selected.filter(
    (item: any) => item.value
  ).length;

  const searchUsers = (value:string) => {
    const match = allUsers?.filter((user: any) => {
      const search = value.toLowerCase();
      switch (searchType) {
        case 'name':
          return (
            user.firstname?.toLowerCase().includes(search) ||
            user.lastname?.toLowerCase().includes(search)
          );

        case 'contact':
          return user.contact?.includes(value);

        case 'email':
          return user.email?.toLowerCase().includes(search);

        case 'address':
          const Address = fixAddress(user.address);
          return Address.toLowerCase().includes(search);
        default:
          return false;
      }
    });

    setSelected((prev: any[]) =>
      prev.map((item: any) => ({
        ...item,
        visible:
        value === '' ? 
        true
        : match?.some(
          (user: any) => item.id === `${user.id}-${user.username}`
        ) ?? false,
      }))
    );
  }

  useEffect(()=>{
    if(Object.values(viewFilter).some((filters => !filters))){
      setViewFilter({...viewFilter,all:true})
    }else{
      setViewFilter({...viewFilter,all:false})
    }
  },[
    viewFilter.contact,
    viewFilter.email,
    viewFilter.address
  ]);

  useEffect(()=>{
    searchUsers(searchValue);
  },[searchValue])

  useEffect(()=>{
    refetch
    setUsers(users)
  },[Users,complete])

  return  <>
    <title>{`${import.meta.env.VITE_APP_TITLE} | Dashboard`}</title>
    <div className='contents'>
      <div className="top-panel flex flex-wrap md:flex-nowrap items-center w-full justify-between gap-[var(--gap)] py-[var(--gap)]">
        <h1 className="header-4 mb-0 flex-1 md:flex-initial">Profiles</h1>
        <SearchBar/>
        <DropdownMenu>
          <DropdownMenuTrigger className="md:flex-[1_0_auto] md:order-3" render={
            <Button 
              className="action-menu"
            >
              <Menu/>
              <span>
                <UserCheck/>
                {selectedCount}<em className='max-count'>15</em>
              </span>
            </Button>
          }/>
          <DropdownMenuContent className="dropmenu w-70" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  setFormType('new-user');
                  clearUser()
                  toNewProfile();
                }}
              >
                <UserRoundPlus/>
                Create User
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                Filter View
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                tickerType='visual'
                checked={!viewFilter.all}
                onCheckedChange={(check) =>{
                    setViewFilter({
                      all: check,
                      contact: true,
                      email: true,
                      address: true,
                    });
                  }
                }
                disabled={!viewFilter.all}
              >
                Show All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                tickerType='visual'
                checked={viewFilter.contact}
                onCheckedChange={(checked) =>
                  setViewFilter({contact: checked === true })
                }
              >
                Contact
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                tickerType='visual'
                checked={viewFilter.email}
                onCheckedChange={(checked) =>
                  setViewFilter({email: checked === true })
                }
              >
                Email
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                tickerType='visual'
                checked={viewFilter.address}
                onCheckedChange={(checked) =>
                  setViewFilter({address: checked === true })
                }
              >
                Address
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                Selected Users
                <span>
                  <UserCheck size={'1rem'}/>
                  {selectedCount}<em>15</em>
                </span>
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => checkAll(false)}
                disabled={!hasSelected}
              >
                <CircleX/> Unselect All
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!hasSelected}>
                <View/>
                View Selected
                <div className='collected'>
                  {
                    selected.map((user:any,ctr:number)=>{
                      return user.value && profileIcon(user.firstname,user.lastname,ctr)
                    })
                  }
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DeleteUser 
                variant="icon-text" 
                disabled={!hasSelected}
                batchType="multiple"
              />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {Users?.length > 0 ? 
      <ProfileCard/>:
      <div className="no-result">No Result</div>
      }
    </div>
  </>
  }

export default Contents;