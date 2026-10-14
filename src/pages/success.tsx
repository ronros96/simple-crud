import './page.css';
import { useProfile } from "@src/store/store";
import { loggedOut } from "@lib/helpers/user";
import { Button } from "@components/ui/button";
import { Spinner } from "@components/ui/spinner";

const Success = () =>{
  const username =  useProfile((state:any) => state.username);
  const firstname =  useProfile((state:any) => state.firstname);
  const lastname =  useProfile((state:any) => state.lastname);
  const formType = useProfile((state:any) => state.formType);

  if(username){
    return (
    <section className='container'>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Success`}</title>
      <h1 className='header-4'>
        Success!
      </h1>
      <div className='divider-horizontal'></div>
      <div className='flex flex-col'>
        <h2 className='header-5'>
          {formType === 'created' && <>User: {username}</>}
          {formType === 'success' && <>{firstname}{' '}{lastname}</>}
        </h2>
        {formType === 'created' && 
        <p>
          Profile for <strong className="uppercase text-[var(--button)]"> {firstname}{' '}{lastname}</strong> has been successfully created.<br/>
          Now it's time to test your profile!
        </p>}
        {formType === 'success' && <>
        <p>You've successfully updated your profile.</p>
        <p className='mb-[var(--gap2x)]'>Since you've updated your credentials<br/>
        <strong className="text-[var(--button)]">Username and/or Password,</strong>
        <br/>you need to reset your session.</p></>}
        <Button onClick={()=>{
          loggedOut();
        }}>
          {formType === 'created' && `Go to Login`}
          {formType === 'success' && `Log-out`}
        </Button>
      </div>
    </section>
    )
  }else{
    return(
    <section className='container'>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Success`}</title>
      <p className='flex items-center gap-[var(--gap)] mb-0'>
        Redirecting <Spinner/>
      </p>
    </section>
    ) 
  }
}
export default Success;