import './profile.css';
import clsx from 'clsx';
import { useEffect, useState } from "react"
import { City, Country, State } from "country-state-city";
import type {ICountry, IState, ICity} from "country-state-city";
//ui
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select"
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
import { Label } from "@components/ui/label"
import { Checkbox } from "@components/ui/checkbox"
import { PhoneInput } from "@components/ui/phone"
import { Eye, EyeOff } from "lucide-react"
//state
import { useErrors, useProfile } from "@src/store/store";
// helpers
import {checkAllFields, showRequirements, fieldError, FieldOrginizer} from "@src/lib/helpers/field"
import {ProfileFields} from "@src/fields/profile"
//hooks
import { useGetUsers, usePutUser } from '@hooks/Profile';

const Profile = () => {
  let countryData = Country.getAllCountries();
  const [stateData, setStateData] = useState<IState[]>([]);
  const [cityData, setCityData] = useState<ICity[]>([]);
  const [country, setCountry] = useState<ICountry | null>(null);
  const [state, setState] = useState<IState | null>(null);
  const [city, setCity] = useState<ICity | null>(null); 

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
  const active = useProfile((state:any) => state.active);
  const setProfile = useProfile((state:any) => state.setProfile);
  const Users = useProfile((state:any) => state.Users);
  const setUsers = useProfile((state:any) => state.setUsers);
  //status logged
  const formType = useProfile((state:any) => state.formType);
  const setFormType = useProfile((state:any) => state.setFormType);
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
    setErrors([])
  }

  const closeForm = () => {
    clearForm();
    setFormType('');
  }

  const setAddress = (
    value:string[],
  ) => {

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
    
    const result = checkAllFields(fields,'trigger');  
    // console.log(result)
    if(Object.values(result).every(value => value === "good")){
      alert();
    }else{
      console.log(result)
      setErrors(result);
    };
  }

  /*check username if avail */
  const {data: allUsers} = useGetUsers();


  useEffect(()=>{
    setUsers(allUsers)
  },[Users])

  useEffect(() => {
    if(country){
      setStateData(State.getStatesOfCountry(country?.isoCode));
      setCityData([])
    }
  }, [country]);

  useEffect(() => {
    if(country && state){
      setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
    }
  }, [state]);


  return (
    <>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Sign-In`}</title>
      <div className="important">
        <strong>* Required</strong><br/>
        <p className={clsx('err-msg',{'show':Object.values(errors).some(value => value !== 'good')})}>
          Please fill in all required fields and check the requirements.
        </p>
      </div>
      <form action={submitForm}>
        <div className="profile-container">
          <div className="profile-form">
            <p><strong>Please make sure to follow certain requirements on creating an account.</strong></p>
            <div className="form-group grid grid-cols-2">
              {FieldOrginizer(ProfileFields,'firstname') &&
              <Field className={clsx('form-group',{'error':fieldError(errors,'firstname')})}>
                <FieldLabel htmlFor="firstname">First Name<span className="important">*</span>:</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="firstname"
                    name="firstname"
                    value={firstname}
                    onChange={(e) => setProfile({firstname:e.target.value})}
                    type="text"
                    aria-required="true"
                  />
                </InputGroup>
              </Field>}
              {FieldOrginizer(ProfileFields,'lastname') &&
              <Field className={clsx('form-group',{'error':fieldError(errors,'lastname')})}>
                <FieldLabel htmlFor="lastname">Last Name<span className="important">*</span>:</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="lastname"
                    name="lastname"
                    value={lastname}
                    onChange={(e) => setProfile({lastname:e.target.value})}
                    type="text"
                    aria-required="true"
                  />
                </InputGroup>
              </Field>}
            </div>
            
            {FieldOrginizer(ProfileFields,'username') &&
            <Field className={clsx('form-group',{'error':fieldError(errors,'username')})}>
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
                  aria-required="true"
                />
              </InputGroup>
              {showRequirements(
                ProfileFields.username,
                username,
                {
                  display:"init",
                  insert:["You can only use period / underscore ( . _ ) for spacing"],
                  unique: "profile",
                }
              )}
            </Field>}

            <div className="divider-horizontal"></div>

            {FieldOrginizer(ProfileFields,'password') &&
            <Field className={clsx('form-group',{'error':fieldError(errors,'password')})}>
              <FieldLabel htmlFor="password">Password<span className="important">*</span>:</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
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
              {showRequirements(
                ProfileFields.password,
                password,
                {
                  display:"init",
                }
              )}
            </Field>}
          </div>
          
          <div className="profile-form">
            <p><strong>This is for Demo purposes only, please refrain to use real information, and be wholesome &#128522;</strong></p>
            

            
            {FieldOrginizer(ProfileFields,'mobile') &&
            <Field className={clsx('form-group',{'error':fieldError(errors,'mobile')})}>
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
            </Field>}

            {FieldOrginizer(ProfileFields,'email') &&
            <Field className={clsx('form-group',{'error':fieldError(errors,'email')})}>
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
              {showRequirements(
                ProfileFields.email,
                email,
                {
                  display:"trigger"
                })}
            </Field>}

            {FieldOrginizer(ProfileFields,'address') &&
            <FieldSet className={clsx('form-group',{'error':fieldError(errors,'address')})}>
              <FieldLegend>Residential Address<span className="important">*</span>:</FieldLegend>
              <FieldGroup>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Select id="country" >
                  <SelectTrigger className="w-full">
                    <SelectValue  placeholder="Choose Country" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectGroup>
                      <SelectLabel>Choose Country</SelectLabel>
                      {countryData.map((item) => (
                        <SelectItem key={item.isoCode} value={item.name} onClick={()=>{setCountry(item)}}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {stateData.length > 0 && <>
                <FieldLabel htmlFor="country">State / Region</FieldLabel>
                <Select id="State">
                  <SelectTrigger className="w-full">
                    <SelectValue  placeholder="Choose State" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectGroup>
                      <SelectLabel>Choose State</SelectLabel>
                      {stateData.map((item) => (
                        <SelectItem key={item.isoCode} value={item.name} onClick={()=>{setState(item)}}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </>}

                {cityData.length > 0 && <>
                <FieldLabel htmlFor="country">City / Municipality</FieldLabel>
                <Select id="City" >
                  <SelectTrigger className="w-full">
                    <SelectValue  placeholder="Choose City" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectGroup>
                      <SelectLabel>Choose City</SelectLabel>
                      {cityData.map((item) => (
                        <SelectItem key={item.stateCode} value={item.name} onClick={()=>{setCity(item)}}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </>}

                {
                  cityData?.length > 0
                }
                
              </FieldGroup>
            </FieldSet>}
          </div>

          <div className={clsx('form-group full-width md:flex justify-end',{'error':fieldError(errors,'terms')})}>
            <FieldGroup className="form-group grid">
              {FieldOrginizer(ProfileFields,'terms') &&
              <Field orientation="horizontal">
                <Checkbox 
                  id="terms" 
                  name="terms"
                  title="Terms and Condition"
                  checked={terms}
                  onCheckedChange={(value) => setProfile({terms:!!value})}
                  aria-required="true"
                />
                <Label htmlFor="terms" className='normal text-sm'>
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
                {showRequirements(
                  ProfileFields.terms,
                  terms,
                  {
                    title:"Terms and Condition",
                    display:fieldError(errors,'terms') ? "trigger" : "init"
                  }
                )}
              </Field>}

              {FieldOrginizer(ProfileFields,'active') &&
              <Field orientation="horizontal">
                <Checkbox 
                  id="active" 
                  name="active"
                  checked={active}
                  onCheckedChange={(value) => setProfile({active:!!value})}
                />
                <Label htmlFor="active" className='text-sm uppercase'>
                  Active
                </Label>
              </Field>}
            </FieldGroup>
              

            <div className='grid grid-cols-2 gap-4 w-full mt-[1rem] md:mt-0'>
              {formType === 'sign-in' &&
              <Button type="submit">Register</Button>}
              {formType === 'update' &&
              <Button type="submit">Update</Button>}
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