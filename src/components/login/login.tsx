import './login.css';
import { useState } from "react"
import clsx from 'clsx';
import { useLogin, useProfile } from "@src/store/store";
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
import { Eye, EyeOff, ChevronDown } from "lucide-react"

const Login = () => {
  // const setLogin = useLogin((state:any) => state.setLogin);
  const username = useLogin((state:any) => state.username);
  const password = useLogin((state:any) => state.password);
  const setUsername = useLogin((state:any) => state.setUsername);
  const setPassword = useLogin((state:any) => state.setPassword);

  const setFormType = useProfile((state:any) => state.setFormType);

  const [showPassword, setShowPassword] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  const clearForm = (e:any) => {
    e.preventDefault;
    setShowPassword(false);
    setUsername("");
    setPassword("");
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
          <p>This is just a simple profile CRUD.<br/>Just to showcase my development skills in type of system using React JS.</p>
          <p>
            <strong>Still no account yet?</strong><br/>Let’s start by signing-in:<br/>
          </p>
          <Button onClick={() => setFormType('sign-in')}>Let Me Sign-In!</Button>
        </div>

        <div className="divider-vertical"></div>
        
                <form className="login-form">
          <Field className="form-group">
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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