import "./backcancel.css";
import { ArrowLeft} from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { clearForm, clearUser } from "@lib/helpers/user";
import { useProfile } from "@src/store/store";
import { useRoute } from "@lib/helpers/routes";

const BackCancel = (props:any) =>{
  const type = props.type;
  //hooks
  const formType = useProfile((state:any) => state.formType);
  const setFormType = useProfile((state:any) => state.setFormType);
  //navigation
  const { toLogin, toDashboard } = useRoute();

  const returnDashboard = [
    'update-profile',
    'update-user',
    'new-user'
  ]

  const mainPages = [
    'login',
    'dashboard'
  ]

  const closeForm = () => {
    if(formType === 'sign-in'){
      setFormType('login');
      clearUser();
      clearForm();
      toLogin();
    }else if(returnDashboard.includes(formType)){
      setFormType('dashboard');
      clearUser();
      toDashboard()
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={
        type === 'header' ?
        <Button 
          variant="outline"
          className='back'
        >
          <ArrowLeft size={'1rem'}/>
          Back
        </Button>:
        <Button variant="outline" className="stroke">Cancel</Button>
      } />
      <DialogContent className="modal sm all-centered">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription className="text-center">
            Some of your updates will be gone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='items-center flex-col flex-row'>
          {formType === 'sign-in'  && <>
          <DialogClose render={<Button variant="outline" className="sm" onClick={clearForm}>Clear Form</Button>} />
          <div className='divider-vertical'></div></>
          }
          {formType === 'new-user'  && <>
          <DialogClose render={<Button variant="outline" className="sm" onClick={clearUser}>Clear Form</Button>} />
          <div className='divider-vertical'></div></>
          }
          <Button 
            className="stroke sm" 
            onClick={closeForm}
            disabled={mainPages.includes(formType)}
          >
            {
              formType === 'sign-in' ? 'Yes, Back to login' :
              returnDashboard.includes(formType) ? 'Yes, Back to Dashboard' :
              'Closing...'
            }
          </Button>
          <DialogClose
            render={<Button variant="outline" className="stroke sm">Cancel</Button>}
            disabled={mainPages.includes(formType)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BackCancel;