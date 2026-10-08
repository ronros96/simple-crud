import clsx from 'clsx';
import { useEffect, useState, useRef, useMemo } from "react";
import { 
  Eye,
  Lock,
  CircleX,
  CircleCheck,
  UserCheck,
  UserRoundX,
  UserRoundPlus,
  View,
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
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { Progress } from "@components/ui/progress"
import SearchBar from '@components/search/search';

import { useProfile, useUser, useSearch } from "@src/store/store";
import { useGetUsers } from '@hooks/Profile';
import ProfileCard from '@components/cards/profileCard';

import { clearUser, fixAddress } from '@lib/helpers/user';
import { useRoute } from '@lib/helpers/routes';

import { profileIcon } from "@lib/helpers/user";
// import type { User } from '@src/fields/type';

const Contents = () =>{
  //local states
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
  //hooks
  const {data: allUsers} = useGetUsers();
  //navigation
  const { toNewProfile } = useRoute()

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

  const users = useMemo(
    () => allUsers?.filter((user) => !(user.id === userID && user.username === username)) ?? [],
    [allUsers, userID, username]
  );

  useEffect(()=>{
    setUsers(users)
  },[Users])

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
          <DropdownMenuContent className="dropmenu w-60" align="end">
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
                checked={viewFilter.name}
                onCheckedChange={(checked) =>
                  setViewFilter({ ...viewFilter, name: checked === true })
                }
                
              >
                Name
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                tickerType='visual'
                checked={viewFilter.mobile}
                onCheckedChange={(checked) =>
                  setViewFilter({ ...viewFilter, mobile: checked === true })
                }
              >
                Mobile
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                tickerType='visual'
                checked={viewFilter.email}
                onCheckedChange={(checked) =>
                  setViewFilter({ ...viewFilter, email: checked === true })
                }
              >
                Email
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                tickerType='visual'
                checked={viewFilter.address}
                onCheckedChange={(checked) =>
                  setViewFilter({ ...viewFilter, address: checked === true })
                }
              >
                Address
              </DropdownMenuCheckboxItem>
              {/* <DropdownMenuCheckboxItem
                checked={viewFilter.mobile}
                onCheckedChange={(checked) =>
                  setViewFilter({ ...viewFilter, mobile: checked === true })
                }
              >
                <Lock/>
                Lock Selected User(s)
              </DropdownMenuCheckboxItem> */}
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
                onClick={() => checkAll(true)}
              >
                <CircleCheck/> Select All
              </DropdownMenuItem>
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
              <DropdownMenuItem 
                disabled={!hasSelected}
                variant="destructive"
                onClick={()=>{
                  setOpen(!open)
                }}
              >
                <UserRoundX/>
                Delete All Selected
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

export default Contents;