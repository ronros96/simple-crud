import { useState, useRef } from "react";
import type { User } from '@src/fields/type';
import {
  UserRoundX,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Progress } from "@components/ui/progress";
import { Button } from "@components/ui/button";
import { toast } from "@components/ui/toast";
//hooks
import { useDeleteUser } from '@hooks/Profile';
//states
import { useUser, useDelete, useProfile, useUserAction} from "@src/store/store";
//helpers
import { usePath, useRoute } from "@lib/helpers/routes";
import { clearForm, clearUser, profileIcon } from "@lib/helpers/user";
import { SiTrueup } from "react-icons/si";

const DeleteUserButton = (props:any) =>{
  //props
  const variant = props.variant;
  const disabled = props.disabled;
  const batchType = props.batchType;
  const setTrigger = useUserAction((state: any) => state.setTrigger);

  const openDialog = () =>{
    setTrigger({
      batchType: batchType,
      isOpen: SiTrueup
    });
  }

  return variant === 'icon-text' ?
  <Button 
    className="text-only delete"
    disabled={disabled}
    onClick={openDialog}
  >
    <UserRoundX/>
    Delete User
  </Button>:
  variant === 'stroke' ?
  <Button 
    className="delete stroke sm"
    onClick={openDialog}
  >
    Delete User
  </Button>:
  <Button
    className="delete sm"
    onClick={openDialog}
  >
    Delete User
  </Button>
}

const DeleteUser = () => {
  //routes
  const cleanPath = usePath();
  const { toDashboard } = useRoute()
  //global states
  const selected = useUser((state:any) => state.selected);
  const UserPicked = useUser((state: any) => state.UserPicked);
  const setFormType = useProfile((state: any) => state.setFormType);
  const complete = useDelete((state:any) => state.complete);
  const setComplete = useDelete((state:any) => state.setComplete);
  const Trigger = useUserAction((state: any) => state.Trigger);
  const setTrigger = useUserAction((state: any) => state.setTrigger);
  //hooks
  const deleteUser = useDeleteUser();
  //local states
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
        if(cleanPath === 'update'){
          setFormType('dashboard');
          toDashboard();
        }
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
      const usersToDelete = Trigger.batchType === 'multiple' ? selected.filter(
        (user: User) => user.value
      ) : [UserPicked];
      const total = usersToDelete.length;

      for (let i = 0; i < total; i++) {
        const user = usersToDelete[i];
        await deleteUser.mutateAsync(user.userID);
        const deletePercent = ((i + 1) / total) * 100;
        toast.add({
          type: "error",
          description: <><strong>{user.firstname}{' '}{user.lastname}</strong><br/>has been successfully deleted.</>,
        });
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
    setTrigger({
      batchType:'',
      isOpen:false
    });
    setProgress(0);
    setConfirm(false);
    setComplete(false);
    if(cleanPath === 'update'){
      clearForm();
      clearUser();
    }else{
      clearUser();
    }
  }

  return (
    <Dialog open={Trigger.isOpen}>
      <DialogContent 
        className="modal sm all-centered"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Delete {selectedCount > 1 ? 'Users':'User'}?</DialogTitle>
          <DialogDescription className="text-center mb-0">
            {Trigger.batchType === 'multiple' ? 
              <>
              <p>All Selected {selectedCount > 1 ? 'users':'user'} will be permanently deleted.</p>
              <div className="profile-list">
                {
                  selected.map((user:any,ctr:number)=>{
                    return user.value && profileIcon(user.firstname,user.lastname,ctr)
                  })
                }
              </div>
              </>:
              <><strong>{UserPicked.firstname}{' '}{UserPicked.lastname}</strong> will be permanently deleted.</>
            }
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
          {!confirm && <Button 
              className="stroke sm"
              onClick={()=>setTrigger({
                batchType:'',
                isOpen:false
              })}
            >
              Cancel
          </Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export {
  DeleteUserButton,
  DeleteUser
}