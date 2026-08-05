import './profile.css';
import { useState } from "react"
import { useProfile } from "@src/store/store";
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
import { PhoneInput } from "@components/ui/phone"
import { Eye, EyeOff } from "lucide-react"

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);

  const isSignedIn = useProfile((state:any) => state.isSignedIn);
  const username = useProfile((state:any) => state.username);
  const password = useProfile((state:any) => state.password);
  const firstname = useProfile((state:any) => state.firstname);
  const lastname = useProfile((state:any) => state.lastname);
  const mobile = useProfile((state:any) => state.mobile);
  const email = useProfile((state:any) => state.email);
  const address = useProfile((state:any) => state.address);
  const terms = useProfile((state:any) => state.terms);
  const booklimit = useProfile((state:any) => state.booklimit);
  const role = useProfile((state:any) => state.role);
  const active = useProfile((state:any) => state.active);
  const created = useProfile((state:any) => state.created);
  const setSignIn = useProfile((state:any) => state.setSignIn);
  const setProfile = useProfile((state:any) => state.setProfile);

  type UsernameRules = {
    characters: string,
    spaces: string,
    valid: boolean,
  }

  const validateUsername = (username: string):UsernameRules => {
    const chr = username.length > 0 ? 
        username.length >= 5 ? 'good' : 'err' : '';
    const spc = username.length > 0 ?
       !/\s/.test(username) ? 'good' : 'err' : '';

    return {
      characters: chr,
      spaces: spc,
      valid: chr == 'good' && spc == 'good', 
    }
  }

  type PasswordRules = {
    characters: string,
    capital: string,
    small:string,
    number:string,
    special:string,
    spaces: string,
    valid:boolean,
  }

  const validatePassword = (password: string):PasswordRules => {
    const chr = password.length > 0 ? 
        password.length >= 10 ? 'good' : 'err' : '';
    const cap = password.length > 0 ? 
        /[A-Z]/.test(password) ? 'good' : 'err' : '';
    const sml = password.length > 0 ? 
        /[a-z]/.test(password) ? 'good' : 'err' : '';
    const num = password.length > 0 ? 
        /\d/.test(password) ? 'good' : 'err' : '';
    const spe = password.length > 0 ? 
        /[!@#$%^&*(),.?":{}|<>_-]/.test(password) ? 'good' : 'err' : '';
    const spc = password.length > 0 ?
       !/\s/.test(password) ? 'good' : 'err' : '';

    return {
      characters: chr,
      capital: cap,
      small: sml,
      number: num,
      special: spe,
      spaces: spc,
      valid: chr == 'good' && cap == 'good' && sml == 'good' && num == 'good' && spe == 'good' && spc == 'good', 
    }
  }


  const clearForm = () => {
    setProfile({
      username:'',
      password:'',
      firstname:'',
      lastname:'',
      mobile:'',
      email:'',
      address:'',
      terms:false,
      booklimit:0,
      role:0,
      active: false,
    })
  }

  const closeForm = () => {
    clearForm();
    isSignedIn && setSignIn(false);
  }

  const submitForm = (e:any) =>{
    e.preventDefault;
    
  }

  return (
    <>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Sign-In`}</title>
      <p className="important">
        <strong>* Required</strong><br/>
        <em>All accounts created will expire within a month.</em>
      </p>
      <form action={submitForm}>
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
              <ul className='rules'>
                <li className={validatePassword(password).characters}>Must be more than 10 characters.</li>
                <li>There should be at least:</li>
                <ul>
                  <li className={validatePassword(password).capital}>1 capital letter</li>
                  <li className={validatePassword(password).small}>1 small letter</li>
                  <li className={validatePassword(password).number}>1 number</li>
                  <li className={validatePassword(password).special}>1 special character</li>
                </ul>
                <li className={validatePassword(password).spaces}>No spaces</li>
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
                <PhoneInput
                  id="mobile"
                  name="mobile"
                  value={mobile}
                  onChange={(value) => setProfile({mobile:value})}
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
                      <DialogClose render={<Button variant="outline" className="stroke sm" >Agreed!</Button>} />
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
                  <DialogDescription className="text-center">
                    Some of your updates will be gone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" className="sm" onClick={clearForm}>Clear Form</Button>} />
                  <div className='divider-vertical'></div>
                  <Button className="stroke sm" onClick={closeForm}>Yes, Back to login</Button>
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
export default Profile;