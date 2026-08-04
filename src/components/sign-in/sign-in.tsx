import './sign-in.css';
import { useState } from "react"
import { useLogin } from "@src/store/store";
import {
  Field,
  FieldLabel,
} from "@components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@components/ui/input-group"
import { Button } from "@components/ui/button"
import { Textarea } from "@components/ui/textarea"
import { Eye, EyeOff } from "lucide-react"

const SignIn = () => {
  const username = useLogin((state:any) => state.username);
  const password = useLogin((state:any) => state.password);
  const setUsername = useLogin((state:any) => state.setUsername);
  const setPassword = useLogin((state:any) => state.setPassword);

  const [showPassword, setShowPassword] = useState(false)
  const clearForm = () => {
    setShowPassword(false);
    setUsername("");
    setPassword("");
  }
  
  return (
    <>
      <p className="important">
        <strong>* Required</strong><br/>
        <em>All accounts created will expire within a month.</em>
      </p>
      <form>
        <div className="signin-container">
          <div className="signin-form">
            <p><strong>Please make sure to follow certain rules on creating an account.</strong></p>
            <Field className="form-group">
              <FieldLabel htmlFor="username">Username<span className="important">*</span>:</FieldLabel>
              <ul>
                <li>Must be more than 5 characters</li>
                <li>No spaces use underscore instead “_”</li>
              </ul>
              <InputGroup>
                <InputGroupInput
                  id="username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  aria-required="true"
                />
              </InputGroup>
            </Field>

            <Field className="form-group">
              <FieldLabel htmlFor="password">Password<span className="important">*</span>:</FieldLabel>
              <ul>
                <li>Must be more than 10 characters.</li>
                <li>There should be at least:</li>
                <ul>
                  <li>1 capital letter</li>
                  <li>1 small letter</li>
                  <li>1 number</li>
                  <li>1 special character</li>
                </ul>
                <li>No spaces</li>
              </ul>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-required="true"
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
            </Field>
          </div>

          <div className="divider-vertical"></div>
          
          <div className="signin-form">
            <p><strong>This is for Demo purposes only, please refrain to use real information.</strong></p>
            
            <div className="form-group grid grid-cols-2">
              <Field className="form-group">
                <FieldLabel htmlFor="firstName">First Name<span className="important">*</span>:</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="firstName"
                    name="firstName"
                    type="text"
                    aria-required="true"
                  />
                </InputGroup>
              </Field>
              <Field className="form-group">
                <FieldLabel htmlFor="lastName">Last Name<span className="important">*</span>:</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="lastName"
                    name="lastName"
                    type="text"
                    aria-required="true"
                  />
                </InputGroup>
              </Field>
            </div>
            
            <Field className="form-group">
              <FieldLabel htmlFor="mobile">Mobile Number<span className="important">*</span>:</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="mobile"
                  name="mobile"
                  type="text"
                  aria-required="true"
                  aria-telephone="true"
                />
              </InputGroup>
            </Field>

            <Field className="form-group">
              <FieldLabel htmlFor="email">Email Address<span className="important">*</span>:</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  name="email"
                  type="text"
                  aria-required="true"
                  aria-email="true"
                />
              </InputGroup>
            </Field>

            <Field className="form-group">
              <FieldLabel htmlFor="address">Residential Address<span className="important">*</span>:</FieldLabel>
              <Textarea 
                id="address" 
                name="address" 
                aria-required="true"
                aria-address="true"
              />
            </Field>
          </div>
          
          <div className="divider-horizontal full-width"></div>

          <div className="form-group full-width flex justify-end">
            <Button type="submit">Login</Button>
            <Button 
              className="stroke" 
              onClick={clearForm}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
export default SignIn;