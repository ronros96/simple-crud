import './sign-in.css';
import { useEffect, useState } from "react"
import { useSignIn } from "@src/store/store";
import {
  Field,
  FieldLabel,
} from "@components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@components/ui/input-group"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog"
import { Button } from "@components/ui/button"
import { Textarea } from "@components/ui/textarea"
import { Label } from "@components/ui/label"
import { Checkbox } from "@components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const username = useSignIn((state:any) => state.username);
  const password = useSignIn((state:any) => state.password);
  const firstname = useSignIn((state:any) => state.firstname);
  const lastname = useSignIn((state:any) => state.lastname);
  const mobile = useSignIn((state:any) => state.mobile);
  const email = useSignIn((state:any) => state.email);
  const address = useSignIn((state:any) => state.address);
  const terms = useSignIn((state:any) => state.terms);
  const setSignIn = useSignIn((state:any) => state.setSignIn);
  const setProfile = useSignIn((state:any) => state.setProfile);

  type UsernameRules = {
    characters: string,
    spaces: string,
  }

  const validateUsername = (username: string):UsernameRules => {
    return {
      characters: username.length > 0 ? 
        username.length >= 5 ? 'good' : 'err' : '',
      spaces: username.length > 0 ?
       !/\s/.test(username) ? 'good' : 'err' : '',
    }
  }
  
  
  const clearForm = () => {
    setSignIn(false)
  }

  const closeForm = () => {
    clearForm();
    setSignIn(false)
  }

  useEffect(()=>{
    console.log(username.length)
  },[]);

  return (
    <>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Sign-In`}</title>
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
              <InputGroup>
                <InputGroupInput
                  id="username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setProfile({username:e.target.value})}
                  placeholder="Enter username"
                  aria-required="true"
                />
              </InputGroup>
              <ul className='rules'>
                <li className={validateUsername(username).characters} >Must be more than 5 characters</li>
                <li className={validateUsername(username).spaces}>No spaces use underscore instead “_”</li>
              </ul>
            </Field>

            <div className="divider-horizontal"></div>

            <Field className="form-group">
              <FieldLabel htmlFor="password">Password<span className="important">*</span>:</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setProfile({password:e.target.value})}
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
            </Field>
          </div>
          
          <div className="signin-form">
            <p><strong>This is for Demo purposes only, please refrain to use real information, and be wholesome &#128522;</strong></p>
            
            <div className="form-group grid grid-cols-2">
              <Field className="form-group">
                <FieldLabel htmlFor="firstName">First Name<span className="important">*</span>:</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="firstName"
                    name="firstname"
                    value={firstname}
                    onChange={(e) => setProfile({firstname:e.target.value})}
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
                    name="lastname"
                    value={lastname}
                    onChange={(e) => setProfile({lastname:e.target.value})}
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
                  value={mobile}
                  onChange={(e) => setProfile({mobile:e.target.value})}
                  type="text"
                  aria-required="true"
                />
              </InputGroup>
            </Field>

            <Field className="form-group">
              <FieldLabel htmlFor="email">Email Address<span className="important">*</span>:</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setProfile({email:e.target.value})}
                  type="text"
                  aria-required="true"
                />
              </InputGroup>
            </Field>

            <Field className="form-group">
              <FieldLabel htmlFor="address">Residential Address<span className="important">*</span>:</FieldLabel>
              <Textarea 
                id="address" 
                name="address" 
                value={address}
                onChange={(e) => setProfile({address:e.target.value})}
                aria-required="true"
              />
            </Field>
          </div>

          <div className="form-group full-width flex justify-end">
            <Field orientation="horizontal">
              <Checkbox 
                id="terms-checkbox" 
                name="terms"
                checked={terms}
                onCheckedChange={(value) => setProfile({terms:!!value})}
                aria-required="true"
              />
              <Label htmlFor="terms-checkbox" className='normal text-sm'>
                By signing up you agree to our
                <Dialog>
                  <DialogTrigger render={<Button variant="outline" className="link-only px-[.25rem]">terms and conditions</Button>} />
                  <DialogContent className="modal sm all-centered">
                    <DialogHeader>
                      <DialogTitle>What Terms and Conditions!?</DialogTitle>
                      <DialogDescription>
                        <img src="meme-1.png"/>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose render={<Button variant="outline" className="stroke" >Agreed!</Button>} />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Label>
            </Field>
            <Button type="submit">Register</Button>
            <Dialog>
              <DialogTrigger render={<Button variant="outline" className="stroke">Cancel</Button>} />
              <DialogContent className="modal sm all-centered">
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button className="sm" onClick={clearForm}>Clear Form</Button>
                  <div className='divider-vertical'></div>
                  <Button className="stroke sm" onClick={closeForm}>Yes</Button>
                  <DialogClose render={<Button variant="outline" className="stroke sm" >No</Button>} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </form>
    </>
  )
}
export default SignIn;