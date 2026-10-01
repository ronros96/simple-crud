import "./backcancel.css";
import { useNavigate } from 'react-router';
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
import { clearForm } from "@lib/helpers/user";
import { useProfile } from "@src/store/store";

const BackCancel = (props:any) =>{

  const type = props.type;
  const formType = useProfile((state:any) => state.formType);
  const setFormType = useProfile((state:any) => state.setFormType);
  const navigate = useNavigate();

  const returnDashboard = [
    'update-profile',
    'new-user'
  ]

  const closeForm = () => {
    clearForm;
    switch(formType){
      case 'sign-in':
        navigate('/')
        setFormType('login');
      break;
      case 'update-profile':
      case 'new-user':
        navigate('/dashboard')
        setFormType('dashboard');
      break;
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
          {formType === 'sign-in' && <>
          <DialogClose render={<Button variant="outline" className="sm" onClick={clearForm}>Clear Form</Button>} />
          <div className='divider-vertical'></div></>
          }
          <Button className="stroke sm" onClick={closeForm}>
            {formType === 'sign-in' && 'Yes, Back to login'}
            {returnDashboard.includes(formType) && 'Yes, Back to Dashboard'}
          </Button>
          <DialogClose render={<Button variant="outline" className="stroke sm">Cancel</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BackCancel;