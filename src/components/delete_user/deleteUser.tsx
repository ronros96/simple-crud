import { useState, useRef } from "react";
import type { User } from '@src/fields/type';
import {
  UserRoundX,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Progress } from "@components/ui/progress";
import { Button } from "@components/ui/button";
//hooks
import { useDeleteUser } from '@hooks/Profile';
//states
import { useUser, useDelete, useProfile, useUserAction} from "@src/store/store";
//helpers
import { usePath, useRoute } from "@lib/helpers/routes";
import { clearForm, clearUser } from "@lib/helpers/user";

const DeleteUser = (props:any) => {
  //props
  const variant = props.variant;
  const disabled = props.disabled;
  const batchType = props.batchType;
  //routes
  const cleanPath = usePath();
  const { toDashboard } = useRoute()
  //global states
  const selected = useUser((state:any) => state.selected);
  const UserPicked = useUser((state: any) => state.UserPicked);
  const setFormType = useProfile((state: any) => state.setFormType);
  const complete = useDelete((state:any) => state.complete);
  const setComplete = useDelete((state:any) => state.setComplete);
  const setUserAction = useUserAction((state: any) => state.setUserAction);
  //hooks
  const deleteUser = useDeleteUser();
  //local states
  const [open,setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const duration = 1000;

  const selectedCount: number = selected.filter(
    (item: any) => item.value
  ).length;

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
      const usersToDelete = batchType === 'multiple' ? selected.filter(
        (user: User) => user.value
      ) : [UserPicked];
      const total = usersToDelete.length;

      for (let i = 0; i < total; i++) {
        const user = usersToDelete[i];
        setUserAction({
          status: 'delete',
          userID: user.id,
          firstname: user.firstname,
          lastname: user.lastname
        });
        await deleteUser.mutateAsync(user.userID);
        const deletePercent = ((i + 1) / total) * 100;
        setProgress(deletePercent);
        if(i + 1 === total){
          setComplete(true);
        }
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const deleteDone = () =>{
    // console.log(UserAction)
    if(cleanPath === 'update'){
      clearForm();
      clearUser();
      setFormType('dashboard');
      toDashboard();
    }else{
      clearUser();
      setOpen(false)
    }
  }

  return (
    <Dialog 
      open={open}
      onOpenChange={() =>{
        setOpen(!open);
        setProgress(0);
        setConfirm(false);
        setComplete(false);
      }}>
        <DialogTrigger render={
        variant === 'icon-text' ?
        <Button 
          className="text-only delete"
          disabled={disabled}
          onClick={()=>{
            setOpen(!open)

          }}
        >
          <UserRoundX/>
          Delete User
        </Button>:
        variant === 'stroke' ?
        <Button 
          className="delete stroke sm"
          onClick={()=>{
            setOpen(!open)
          }}
        >
          Delete User
        </Button>:
        <Button
          className="delete sm"
          onClick={()=>{
            setOpen(!open)
          }}
        >
          Delete User
        </Button>
      } />
      <DialogContent 
        className="modal sm all-centered"
        showCloseButton={false}
      >
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
              onPointerUp={stopProgress}
              onPointerLeave={stopProgress}
              onPointerCancel={stopProgress}
              disabled={confirm}
            >
              {
                !confirm ? <>Confirm{' '}<small>Press & Hold</small></>:
                <>Confirmed</>
              }
              
            </Button>:
            <Button 
              className="sm stroke" 
              disabled={!complete}
              onClick={deleteDone}
            >
              Okay
            </Button>
          }
          {!confirm && <DialogClose render={<Button variant="outline" className="stroke sm">Cancel</Button>}/>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default DeleteUser