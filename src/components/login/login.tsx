import './login.css';
import { useState } from "react"
import clsx from 'clsx';
import { useLogin, useSignIn } from "@src/store/store";
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
import { Eye, EyeOff, ChevronDown } from "lucide-react"

const Login = () => {
  const setLogin = useLogin((state:any) => state.setLogin);
  const username = useLogin((state:any) => state.username);
  const password = useLogin((state:any) => state.password);
  const setUsername = useLogin((state:any) => state.setUsername);
  const setPassword = useLogin((state:any) => state.setPassword);

  const setSignIn = useSignIn((state:any) => state.setSignIn);

  const [showPassword, setShowPassword] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  const clearForm = () => {
    setShowPassword(false);
    setUsername("");
    setPassword("");
  }
  
  return (
    <div className="login-container">
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
      <div className="divider-vertical"></div>
      <div className="login-content">
        <h2 className="header-5">Hello There!</h2>
        <p>This is a simple <strong>Library Catalogue System</strong>. Just to show how I develop CRUD type system using React JS.</p>
        <div 
          className="show-content"
          onClick={() => setShowHidden(!showHidden)}
        >
          {showHidden ? 'Hide' : 'Show'}{' '}other credentials
          <ChevronDown className={clsx({'rotate-180':showHidden})}/> 
        </div>
        <div className={clsx('hidden-content',{'show':showHidden})} >
          <p>
            <strong>If you want to enter as an Admin</strong><br/>
            Username: Admin<br/>
            Password: admin<br/>
          </p>
          <p>
            <strong>If you want to enter as an Librarian</strong><br/>
            Username: Librarian<br/>
            Password: books<br/>
          </p>
        </div>
        <p><strong>
            Click SIGN-IN to be a Patron<br/>
          </strong></p>
        <Button onClick={() => setSignIn(true)}>Sign In</Button>
      </div>
    </div>
  )
}
export default Login;