import './page.css';
import clsx from 'clsx';
import { useEffect } from 'react';
import Login from '@components/login/login';
import { useLogin, useProfile } from "@src/store/store";
import { checkLogged } from "@lib/helpers/user";
import { useGetUser } from '@hooks/Profile';
import Profile from '@src/components/profile/profile';
import Contents from './contents';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { Button } from "@components/ui/button"

const Page = () =>{
  const isLogged =  useLogin((state:any) => state.isLogged);
  const id = useLogin((state:any) => state.id);
  const username = useLogin((state:any) => state.username);
  const formType =  useProfile((state:any) => state.formType);
  const {data: validUser} = useGetUser({id:id,username:username});

  useEffect(()=>{
    checkLogged(validUser);
  },[validUser]);

  return(
    <section className={clsx('container',{'header-margin transparent':isLogged})}>
      {
        !isLogged ? (
          formType === 'sign-in' ? (
            <>
              <title>{`${import.meta.env.VITE_APP_TITLE} | Sign-In`}</title>
              <h1 className='header-4'>Sign-in</h1>
              <div className='divider-horizontal'></div>
              <Profile/>
            </>
          ) : (
             <>
              <title>{`${import.meta.env.VITE_APP_TITLE} | Log-in`}</title>
              <h1 className='header-4'>
                <Tooltip>
                <TooltipTrigger delay={300} render={<Button variant="outline" className="text-only p-0">Hello There</Button>} />
                <TooltipContent>
                  <p>General Kenobi!</p>
                </TooltipContent>
              </Tooltip>
              </h1>
              <div className='divider-horizontal'></div>
              <Login/>
            </>
          )
        ) : <Contents/>
      }
    </section>
  )
}
export default Page;