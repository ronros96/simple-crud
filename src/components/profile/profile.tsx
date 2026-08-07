import './profile.css';
import clsx from 'clsx';
import { useState } from "react"
import { useErrors, useProfile, useRole } from "@src/store/store";
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

import {checkAllFields, showRequirements} from "@lib/helper"
import {ProfileFields} from "@src/fields/fields"

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  //fields
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
  const setProfile = useProfile((state:any) => state.setProfile);
  //status logged
  const isSignedIn = useProfile((state:any) => state.isSignedIn);
  const setSignIn = useProfile((state:any) => state.setSignIn);
  const roleLogged = useRole((state:any) => state.roleLogged);
  //errors
  const errors = useErrors((state:any) => state.errors);
  const setErrors = useErrors((state:any) => state.setErrors);

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
    });
  }

  const closeForm = () => {
    clearForm();
    isSignedIn && setSignIn(false);
  }

  const submitForm = (e:any) =>{
    e.preventDefault;
    
    //selected fields to be submitted.
    const state = {
      username,
      password,
      firstname,
      lastname,
      mobile,
      email,
      address,
      terms,
      booklimit,
      role,
      active
    }
    //insert state values to ProfileFields value
    const fields = Object.fromEntries(
      Object.entries(ProfileFields).map(([key, field]) => [
        key,
        {
          ...field,
          value: state[key as keyof typeof state],
        },
      ])
    );
    
    const result = checkAllFields(fields);  
    setErrors([]);
    typeof result === "object" ? setErrors(result) : postForm();
    console.log(result)
  }

  const postForm = () =>{
    alert()
  }

  return (
    <>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Sign-In`}</title>
      <div className="important">
        <strong>* Required</strong><br/>
        <em>All accounts created will expire within a month.</em>
        {/* <p className={clsx('err-msg',{'show':Object.values(errors).some(value => value === true)})}>
          Please fill in all required fields and check the requirements.
        </p> */}
      </div>
      <form action={submitForm}>
        <div className="profile-container">
          <div className="profile-form">
            <p><strong>Please make sure to follow certain requirements on creating an account.</strong></p>
            <Field className={clsx('form-group',{})}>
              <FieldLabel htmlFor="username">Username<span className="important">*</span>:</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => {
                    setProfile({username:e.target.value})
                  }}
                  placeholder="Enter username"
                  aria-required="true"
                />
              </InputGroup>
              {showRequirements(
                ProfileFields.username,
                username,
                true,
                ["You can only use period / underscore ( . _ ) for spacing"]
              )}
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
              {showRequirements(ProfileFields.password,password,true)}
            </Field>
          </div>
          
          <div className="profile-form">
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
                {showRequirements(ProfileFields.firstname,firstname,false)}
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

          <div className="form-group full-width md:flex justify-end">
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

            <div className='grid grid-cols-2 gap-4 w-full mt-[1rem] md:mt-0'>
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
        </div>
      </form>
    </>
  )
}
export default Profile;