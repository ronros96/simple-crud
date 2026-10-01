import './page.css';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
//ui
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@components/ui/input-group"
import { Button } from "@components/ui/button"
import { Skeleton } from "@components/ui/skeleton"
import { Eye, EyeOff } from "lucide-react"
//Hooks
import { useLogin, useProfile, useErrors } from "@src/store/store";
import { checkLogged } from "@lib/helpers/user";
import { useGetUser, useGetUsers, usePutUser  } from '@hooks/Profile';
//helper
import { setLoggedUser } from "@lib/helpers/user";

const Page = () =>{
  interface FormState {
    username: string;
    password: string;
  }
  const isLogged =  useLogin((state:any) => state.isLogged);
  const id = useLogin((state:any) => state.id);
  const username = useLogin((state:any) => state.username);
  const formType =  useProfile((state:any) => state.formType);
  const {data: validUser} = useGetUser({id:id,username:username});
  const navigate = useNavigate();

  //states
  const setLogin = useLogin((state:any) => state.setLogin);
  const setFormType = useProfile((state:any) => state.setFormType);
  const setProfile = useProfile((state:any) => state.setProfile);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<FormState>({ username: "", password: "" });
  //errors
  const errors = useErrors((state:any) => state.errors);
  const setErrors = useErrors((state:any) => state.setErrors);
  

  const clearForm = (e:any) => {
    e.preventDefault;
    setShowPassword(false);
    setErrors('');
    setForm({ username: "", password: "" })
  }

  //login functions
  const {data: allUsers} = useGetUsers();
  const putUser = usePutUser();

  const login = (e:any) =>{
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    if(formProps.username && formProps.password){
      setForm((prev) => ({ ...prev, ...formProps }));
      checkLogin(formProps.username,formProps.password)
    }else{
      clearForm
      setErrors('err');
    }
  }

  const checkLogin = (
    username:any,
    password:any
  ) => {
    const match = Object(allUsers).find(
      (u:any) => u.username === username.trim() && u.password === password
    );

    if(match){
      putUser.mutate({
        id: match.id,
        user: {
          ...match,
          logged: new Date(),
        },
      });
      setLogin(true);
      setProfile({...match});
      setFormType('dashboard');
      setLoggedUser(match.id,match.username);
      navigate('/dashboard');
    }else{
      setForm({ username: "", password: "" })
      setErrors('err');
    }
  }

  useEffect(()=>{
    checkLogged(validUser);
    if(isLogged){
      navigate('/dashboard');
    }
  },[isLogged,validUser]);

  return(
    <section className='container'>
      {
        !isLogged && formType === 'login' && <>
          <title>{`${import.meta.env.VITE_APP_TITLE} | Log-in`}</title>
          <h1 className='header-4'>
            <Tooltip>
            <TooltipTrigger delay={300} render={<Button variant="outline" className="text-only p-0">Hello There</Button>} />
            <TooltipContent>
              <p className='mb-0'>General Kenobi!</p>
            </TooltipContent>
          </Tooltip>
          </h1>
          <div className='divider-horizontal'></div>
          <div className="login-container">
            <form 
              className="login-form" 
              onSubmit={login} 
              action={(e:any)=>{e.preventDefault}}
            >
              <p className={clsx('err-msg',{'show':Object.values(errors).some(value => value !== 'good')})}>
                Invalid username and/or password.
              </p>
              <Field className="form-group">
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <InputGroup>
                  {allUsers ? 
                  <InputGroupInput
                    id="username"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={(e)=>setForm({...form,username:e.target.value})}
                    placeholder="Enter username"
                  />:
                  <Skeleton className="h-5 w-full" />}
                </InputGroup>
              </Field>

              <Field className="form-group">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup>
                  {allUsers ?
                  <>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={(e)=>setForm({...form,password:e.target.value})}
                    placeholder="Enter password"
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      className="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </InputGroupAddon>
                  </>:
                  <Skeleton className="h-5 w-full" />}
                </InputGroup>
                <FieldDescription>
                    {/* <a href="#" className="forgot-password">Forgot Password?</a> */}
                  </FieldDescription>
              </Field>

              <div className="form-group grid grid-cols-2">
                {allUsers ?
                <>
                  <Button type="submit">Login</Button>
                  <Button 
                    className="stroke" 
                    onClick={clearForm}>
                    Cancel
                  </Button>
                </>:
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
                }
              </div>
            </form>

            <div className="divider-vertical"></div>

            <div className="login-content md:flex justify-between flex-col ">
              <p>
                This project uses a mock API, so all login and authentication features are implemented for prototype purposes only.
              </p>
              <div>
                <p>
                  <strong>Don't have an account yet?</strong><br/>Let's start by signing-in:<br/>
                </p>
                {allUsers ?
                <Button onClick={() => {
                  setFormType('sign-in')
                  navigate('/register')
                }}>Let Me Sign-In!</Button>:
                <Skeleton className="h-10 w-[50%]" />
                }
              </div>
            </div>
          </div>
        </>
      }
    </section>
  )
}
export default Page;