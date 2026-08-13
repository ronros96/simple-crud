import './login.css';
import clsx from 'clsx';
import { useEffect, useState } from "react"
//ui
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip"
import { Button } from "@components/ui/button"
import { Eye, EyeOff } from "lucide-react"
//state
import { useLogin, useProfile, useErrors } from "@src/store/store";
//hooks
import { useGetUsers, usePutUser } from '@hooks/Profile';
import type { User } from '@src/api/profile';

const Login = () => {
  interface FormState {
    username: string;
    password: string;
  }

  //states
  const username = useLogin((state:any) => state.username);
  const setUsername = useLogin((state:any) => state.setUsername);
  const setLogin = useLogin((state:any) => state.setLogin);
  const setFormType = useProfile((state:any) => state.setFormType);
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
      setLogin(true);
      putUser.mutate({
        username: username,
        user: {
          ...match,
          logged: new Date(),
        },
      });
      const toLocal = {
        'username':username,
        'datetime':new Date()
      }
      localStorage.setItem('setLogged',JSON.stringify(toLocal));
    }else{
      console.log("pak")
      setForm({ username: "", password: "" })
      setErrors('err');
    }
  }
  
  return (
    <>
      <title>{`${import.meta.env.VITE_APP_TITLE} | User Login`}</title>
      <div className="login-container">        
        <div className="login-content">
          <h2 className='header-5'>
          <Tooltip>
            <TooltipTrigger delay={300} render={<Button variant="outline" className="text-only p-0">Hello There!</Button>} />
            <TooltipContent>
              <p>General Kenobi!</p>
            </TooltipContent>
          </Tooltip>
          </h2>
          <p>
            This project uses a mock API, so all login and authentication features are implemented for prototype purposes only.
          </p>
          <p>
            The main focus of the project is to showcase my front-end development skills, particularly in building a CRUD application using React JS. It demonstrates how I structure API requests, manage application state, handle form validation and errors, and create a responsive user interface for interacting with RESTful API data.
          </p>
          <p>
            <strong>Don't have an account yet?</strong><br/>Let’s start by signing-in:<br/>
          </p>
          <Button onClick={() => setFormType('sign-in')}>Let Me Sign-In!</Button>
        </div>

        <div className="divider-vertical"></div>
        
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
              <InputGroupInput
                id="username"
                type="text"
                name="username"
                value={form.username}
                onChange={(e)=>setForm({...form,username:e.target.value})}
                placeholder="Enter username"
              />
            </InputGroup>
          </Field>

          <Field className="form-group">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
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
            </InputGroup>
            <FieldDescription>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </FieldDescription>
          </Field>

          <div className="form-group grid grid-cols-2">
            <Button type="submit">Login</Button>
            <Button 
              className="stroke" 
              onClick={clearForm}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
    
  )
}
export default Login;