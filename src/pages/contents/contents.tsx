import clsx from 'clsx';
import { useEffect, useState, useRef, useMemo } from "react";
//TS types
import type { User } from '@src/fields/type';
import {
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
//storage
import { useProfile, useUser, useSearch, useFilter } from "@src/store/store";
import { useGetUsers, useDeleteUser } from '@hooks/Profile';
import ProfileCard from '@components/cards/profileCard';
//helpers
import { clearUser, fixAddress } from '@lib/helpers/user';
import { useRoute } from '@lib/helpers/routes';
import { profileIcon } from "@lib/helpers/user";

const Contents = () =>{
  //local states
  const [open,setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [complete, setComplete] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const duration = 1000;
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
  
  //hooks
  const {data: allUsers, refetch} = useGetUsers();
  const deleteUser = useDeleteUser();
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

  const startProgress = () => {
    startTimeRef.current = performance.now();
    const update = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const percentage = Math.min((elapsed / duration) * 100, 100);
      setProgress(percentage);
      if (percentage < 100) {
        timerRef.current = requestAnimationFrame(update);
      }
      if(percentage === 100){
        setConfirm(true);
        setTimeout(()=>{
          handleComplete();
        },1000)
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

  const handleComplete = async () => {
    setProgress(0);
    try {
      const usersToDelete = selected.filter(
        (user: User) => user.value
      );
      const total = usersToDelete.length;

      for (let i = 0; i < total; i++) {
        const user = usersToDelete[i];
        await deleteUser.mutateAsync(user.userID);
        const deletePercent = ((i + 1) / total) * 100;
        setProgress(deletePercent);
      }
      refetch;
      setComplete(true);
    } catch (error: any) {
      alert(error.message);
    }
  };

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
              {/* <DropdownMenuCheckboxItem
                checked={viewFilter.contact}
                onCheckedChange={(checked) =>
                  setViewFilter({ ...viewFilter, contact: checked === true })
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
          setConfirm(false);
          setUsers(allUsers)
          setSelected(allUsers);
        }}>
        <DialogContent className="modal sm all-centered">
          <DialogHeader>
            <DialogTitle>Delete {selectedCount > 1 ? 'Users':'User'}?</DialogTitle>
            <DialogDescription className="text-center mb-0">
              All Selected {selectedCount > 1 ? 'users':'user'} will be permanently deleted.
            </DialogDescription>
            <Progress value={complete ? 100 : progress}>
              {
                progress >= 100 && complete ? 'Deleted!' :
                progress > 1 && !confirm ? 'Confirming...' :
                progress >= 100 && confirm ? 'Confirmed! Starting to delete' :
                progress < 100 && confirm ? 'Deleting...' :
                'Press & Hold the Confirm Button to proceed'
              }
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
                onPointerUp={
                  stopProgress
                }
                onPointerLeave={stopProgress}
                onPointerCancel={stopProgress}
                disabled={confirm}
              >
                {
                  !confirm ? <>Confirm{' '}<small>Press & Hold</small></>:
                  <>Confirmed</>
                }
                
              </Button>:
              <DialogClose render={<Button variant="outline" className="sm stroke" disabled={!complete}>Okay</Button>} />
            }
            {!confirm && <DialogClose render={<Button variant="outline" className="stroke sm">Cancel</Button>}/>}
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