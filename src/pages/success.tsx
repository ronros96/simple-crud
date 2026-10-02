import './page.css';
import { useProfile } from "@src/store/store";
import { useRoute } from "@lib/helpers/routes";
import { clearForm } from "@lib/helpers/user";
import { Button } from "@components/ui/button"

const Success = () =>{
  const username =  useProfile((state:any) => state.username);
  const firstname =  useProfile((state:any) => state.firstname);
  const lastname =  useProfile((state:any) => state.lastname);
  const setFormType = useProfile((state:any) => state.setFormType);
  const { toLogin } = useRoute();

  return (
    <section className='container'>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Success`}</title>
      <h1 className='header-4'>
        Success!
      </h1>
      <div className='divider-horizontal'></div>
      <div>
        <h2 className='header-5'>
          User: {username}
        </h2>
        <p>
          Profile for <strong className="uppercase text-[var(--button)]"> {firstname}{' '}{lastname}</strong> has been successfully created.<br/>
          Now it's time to test your profile!
        </p>
        <Button onClick={()=>{
          setFormType('login');
          clearForm
          toLogin()
        }}>
          Go to Login
        </Button>
      </div>
    </section>
  )
}
export default Success;