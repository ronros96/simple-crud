import clsx from 'clsx';
import { useEffect, useState, useRef } from "react";
import { Country, State } from "country-state-city";
import { 
  Eye,
  Lock,
  CircleX,
  CircleCheck,
  UserCheck,
  UserRoundX,
  UserRoundPlus,
} from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { Progress } from "@components/ui/progress"
import SearchBar from '@components/search/search';

import { useProfile, useUser, useLogin, useSearch } from "@src/store/store";
import { useGetUsers } from '@hooks/Profile';
import ProfileCard from '@components/cards/profileCard';
import Profile from '@components/profile/profile';

const Contents = () =>{
  const [open,setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const duration = 1000;
  const [viewFilter, setViewFilter] = useState({
    name: true,
    mobile: true,
    email: true,
    address: true,
  })
  const profile = ['update-profile','new-user','update-user'];

  const isLogged = useLogin((state:any) => state.isLogged);
  const formType =  useProfile((state:any) => state.formType);
  const setFormType = useProfile((state:any) => state.setFormType);
  const selected = useUser((state:any) => state.selected);
  const setSelected = useUser((state:any) => state.setSelected);
  const setUsers = useUser((state:any) => state.setUsers);
  const Users = useUser((state:any) => state.Users);
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

  const allChecked = selected.every((item:any) => item.value);

  const hasSelected = selected.some(
    (item:any) => item.value === true
  );

  const selectedCount: number = selected.filter(
    (item: any) => item.value
  ).length;

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

  const startProgress = () => {
    startTimeRef.current = performance.now();
    const update = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const percentage = Math.min((elapsed / duration) * 100, 100);
      setProgress(percentage);
      if (percentage < 100) {
        timerRef.current = requestAnimationFrame(update);
      }
    };
    timerRef.current = requestAnimationFrame(update);
  };

  const stopProgress = () => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    setProgress(0);
  };

  const handleComplete = () => {
    setComplete(true);
  };

  // useEffect(()=>{
  //   console.log('selected',selected)
  // },[selected])

  useEffect(()=>{
    searchUsers(searchValue);
  },[searchValue])

  useEffect(()=>{
    setUsers(allUsers)
  },[Users])

  if(isLogged && profile.includes(formType)){
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
        <div className="md:flex items-center w-full justify-between gap-[var(--gap)] py-[var(--gap)]">
          <h1 className="header-4 mb-0">Profiles</h1>
          <SearchBar/>
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button>
                Action
                <span>
                  <UserCheck/>
                  {selectedCount}
                </span>
              </Button>
            }/>
            <DropdownMenuContent className="dropmenu w-80" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setFormType('new-user')}
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
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Eye/>
                    Visible Fields
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuCheckboxItem
                        checked={viewFilter.name}
                        onCheckedChange={(checked) =>
                          setViewFilter({ ...viewFilter, name: checked === true })
                        }
                      >
                        Name
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={viewFilter.mobile}
                        onCheckedChange={(checked) =>
                          setViewFilter({ ...viewFilter, mobile: checked === true })
                        }
                      >
                        Mobile
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={viewFilter.email}
                        onCheckedChange={(checked) =>
                          setViewFilter({ ...viewFilter, email: checked === true })
                        }
                      >
                        Email
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={viewFilter.address}
                        onCheckedChange={(checked) =>
                          setViewFilter({ ...viewFilter, address: checked === true })
                        }
                      >
                        Address
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuCheckboxItem
                  checked={viewFilter.mobile}
                  onCheckedChange={(checked) =>
                    setViewFilter({ ...viewFilter, mobile: checked === true })
                  }
                >
                  <Lock/>
                  Lock Selected User(s)
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  Selected Users
                  <span>
                    <UserCheck size={'1rem'}/>
                    {selectedCount}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => checkAll(!allChecked)}
                >
                {
                  allChecked ?
                  <><CircleX/> Deselect All</>  : 
                  <><CircleCheck/> Select All</>
                }
                </DropdownMenuItem>
                {/* <DropdownMenuItem disabled={!hasSelected}>
                  <View/>
                  View Selected
                </DropdownMenuItem> */}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  disabled={!hasSelected}
                  variant="destructive"
                  onClick={()=>{
                    setOpen(!open)
                  }}
                >
                  <UserRoundX/>
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog 
          open={open} 
          onOpenChange={() =>{
            setOpen(!open);
            setProgress(0);
            setComplete(false);
          }}>
          <DialogContent className="modal sm all-centered">
            <DialogHeader>
              <DialogTitle>Delete {selectedCount > 1 ? 'Users':'User'}?</DialogTitle>
              <DialogDescription className="text-center mb-0">
                All Selected {selectedCount > 1 ? 'users':'user'} will be permanently deleted.
              </DialogDescription>
              <Progress value={complete ? 100 : progress} className={clsx('w-full',{'progress-active':progress > 0 || complete})}>
                {progress >= 100 || complete ? 'Deleted!' : 'Deleting...'}
              </Progress>
            </DialogHeader>
            <DialogFooter className='items-center flex-col flex-row'>
              {
                !complete ?
                <Button 
                  className="sm delete"
                  onClick={(e:any) => {
                    e.preventDefault();
                  }}
                  onPointerDown={startProgress}
                  onPointerUp={() => {
                    if (progress >= 100) {
                      handleComplete();
                    }else{
                      stopProgress();
                    } 
                  }}
                  onPointerLeave={stopProgress}
                  onPointerCancel={stopProgress}
                >
                  Yes{' '}<small>Press + Hold to Proceed</small>
                </Button>:
                <DialogClose render={<Button variant="outline" className="sm stroke">Okay</Button>} />
              }
              <DialogClose render={<Button variant="outline" className="stroke sm">Cancel</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {Users?.length > 0 ? 
        <ProfileCard/>:
        <div className="no-result">No Result</div>
        }
      </div>
    </>
  }
}

export default Contents;