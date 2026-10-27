import './page.css';
import { useState } from 'react';
import clsx from 'clsx';
import { sha256 } from 'crypto-hash';
//ui
import {
  Eye,
  EyeOff
} from "lucide-react";
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

//Hooks
import { useLogin, useProfile, useErrors } from "@src/store/store";
import { useGetUsers, usePutUser } from '@hooks/Profile';
import { useCreateAuthSession } from "@hooks/logs";
//helper
import { useRoute } from "@lib/helpers/routes";


const Page = () => {
  interface FormState {
    username: string;
    password: string;
  }
  const isLogged = useLogin((state: any) => state.isLogged);
  const formType = useProfile((state: any) => state.formType);
  //navigation
  const { toNewProfile } = useRoute();
  //hooks
  const createAuthSession = useCreateAuthSession();
  //states
  const setLogin = useLogin((state: any) => state.setLogin);
  const setFormType = useProfile((state: any) => state.setFormType);
  const setProfile = useProfile((state: any) => state.setProfile);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<FormState>({ username: "", password: "" });
  const [isLoading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState('');
  //errors
  const errors = useErrors((state: any) => state.errors);
  const setErrors = useErrors((state: any) => state.setErrors);


  const clearForm = (e: any) => {
    e.preventDefault;
    clear()
  }

  const clear = () =>{
    setShowPassword(false);
    setErrors([]);
    setForm({ username: "", password: "" })
  }

  const { data: allUsers } = useGetUsers();
  const putUser = usePutUser();

  const login = async () => {
    if (!form.username || !form.password) {
      clear();
      setErrors(['login']);
      return;
    }

    await checkLogin(form.username, form.password);
  };

  const handleUserLogs = async (id: string, user: string) => {
    await createAuthSession.mutateAsync({
      UserId: id,
      username: user,
    });
  };

  const checkLogin = async (
    username: string,
    password: string
  ) => {
    const hashPass = await sha256(password);
    const match = allUsers?.find(
      (u: any) => u.username === username.trim()
    );
    // console.log(password,hashPass)

    if (!match) {
      setForm({ username: '', password: '' });
      setErrors(['login']);
      return;
    }else{
      console.log(match.password ,hashPass)
      if(!match.bot && match.password !== hashPass){
        setForm({ username: '', password: '' });
        setErrors(['login']);
        return;
      }
      else if(match.bot && match.password !== password){
        setForm({ username: '', password: '' });
        setErrors(['login']);
        return;
      }
    }
    clear();
    setFirstname(match.firstname)
    setLoading(true)

    try {
      await putUser.mutateAsync({
        id: match.id,
        user: {
          ...match,
          logged: new Date(),
        },
      });

      await handleUserLogs(match.id, match.username);

      setErrors([]);
      setLogin(true);
      setProfile({ ...match });

    } catch (error) {
      setLogin(false);
      setErrors(['session', String(error)]);
    }
  };

  return (
    <section className={clsx('container', { 'login-success':isLoading})}>
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
          <div className='redirecting'>
            Welcome Back <strong>{firstname}</strong>
          </div>
          <div className="login-container">
            <form
              className="login-form"
              onSubmit={login}
              action={(e: any) => { e.preventDefault }}
            >
              <p className={clsx('err-msg', { 'show': errors[0] === 'login' })}>
                Invalid username and/or password.
              </p>
              <p className={clsx('err-msg', { 'show': errors[0] === 'session' })}>
                Login Failed<br />{errors[1]}
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
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="Enter username"
                    /> :
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
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                    </> :
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
                  </> :
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
                  <strong>Don't have an account yet?</strong><br />Let's start by signing-in:<br />
                </p>
                {allUsers ?
                  <Button onClick={() => {
                    setFormType('sign-in')
                    toNewProfile();
                  }}>Let Me Sign-In!</Button> :
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