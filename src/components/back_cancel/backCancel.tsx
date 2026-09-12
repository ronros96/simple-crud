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

const BackCancel = (type:string) =>{

  const setFormType = useProfile((state:any) => state.setFormType);

  const closeForm = () => {
    clearForm;
    setFormType('');
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" className="stroke">Cancel</Button>} />
      <DialogContent className="modal sm all-centered">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription className="text-center">
            Some of your updates will be gone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='items-center flex-col flex-row'>
          <DialogClose render={<Button variant="outline" className="sm" onClick={clearForm}>Clear Form</Button>} />
          <div className='divider-vertical'></div>
          <Button className="stroke sm" onClick={closeForm}>Yes, Back to login</Button>
          <DialogClose render={<Button variant="outline" className="stroke sm" >Cancel</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BackCancel;