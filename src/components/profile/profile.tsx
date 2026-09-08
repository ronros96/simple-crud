import './profile.css';
import clsx from 'clsx';
import { useEffect, useState, useRef } from "react"
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
import { useGetUsers, usePutUser, useCreateUser } from '@hooks/Profile';

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
  let countryData = Country.getAllCountries();
  const [stateData, setStateData] = useState<IState[]>([]);
  const [cityData, setCityData] = useState<ICity[]>([]);
  const [country, setCountry] = useState<ICountry | null>(null);
  const [state, setState] = useState<IState | null>(null);
  const [city, setCity] = useState<ICity | null>(null); 
  const [addressL1,setAddressL1] =  useState("");
  const [addressL2,setAddressL2] =  useState("");
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

  const countryRef = useRef<HTMLElement | null>(null);
  const stateRef = useRef<HTMLElement | null>(null);
  const cityRef = useRef<HTMLElement | null>(null);

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

  const fixAddress = () => {
    let addInputs = [];
    if(countryRef.current?.innerHTML === "Choose Country"){
      addInputs.push("-country-");
    }else{
      country && addInputs.push(country.isoCode);
    }
    if(stateRef.current?.innerHTML === "Choose State"){
      addInputs.push("-state-");
    }else{
      state && addInputs.push(state.isoCode);
    }
    if(cityRef.current?.innerHTML === "Choose City"){
      addInputs.push("-city-");
    }else{
      city && addInputs.push(city.name);
    }
    if(addressL1 === ""){
      addInputs.push("-addressline-");
    }else{
      addInputs.push(`${addressL1}${" "}${addressL2}`);
    }
    setProfile({address: addInputs});
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
    fixAddress();
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
    setErrors([]);
    if(Object.values(result).every(value => value === "good")){
      if(formType === 'sign-in'){
        usePutUser();
        return
      }else{
        alert('update')
      }
    }else{
      setErrors(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <p className={clsx('err-msg',{'show':Object.values(errors).some(value => value === 'exist')})}>
          Username already exist, please choose another username.
        </p>
      </div>
      <form action={submitForm}>
        <div className="profile-container">
          <div className="profile-form">
            <p className='col-full'>
              <strong>Please make sure to follow certain requirements on creating this account.</strong><br/>
              <strong>This is for Demo purposes only, please refrain to use real information, and be wholesome &#128522;</strong>
            </p>
            
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
            <div className="divider-horizontal col-full"></div>
          </div>

          <div className="profile-form">
            
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
          </div>

          {FieldOrginizer(ProfileFields,'address') && 
          <div className={clsx('profile-form',{'error':fieldError(errors,'address')})}>
            <FieldSet className={clsx('md:grid grid-cols-3 col-full',{'error':fieldError(errors,'address')})}>
              <FieldLegend>Residential Address<span className="important">*</span>:<br/>
              {showRequirements(
                ProfileFields.address,
                address,
                {
                  display:fieldError(errors,'address') ? "trigger" : "none"
                }
              )}
              </FieldLegend>
              <FieldGroup>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Select id="country" onValueChange={fixAddress} >
                  <SelectTrigger className="w-full" >
                    <SelectValue placeholder="Choose Country" ref={countryRef}/>
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectGroup>
                      <SelectLabel>Choose Country</SelectLabel>
                      {countryData.map((item,i) => (
                        <SelectItem key={`${item.isoCode}-${i}`} value={item.name} onClick={()=>{setCountry(item)}}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FieldGroup>

              {stateData.length > 0 && 
              <FieldGroup>
                <FieldLabel htmlFor="country">State / Region</FieldLabel>
                <Select id="State" onValueChange={fixAddress}>
                  <SelectTrigger className="w-full">
                    <SelectValue  placeholder="Choose State" ref={stateRef} />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectGroup>
                      <SelectLabel>Choose State</SelectLabel>
                      {stateData.map((item,i) => (
                        <SelectItem key={`${item.isoCode}-${i}`} value={item.name} onClick={()=>{setState(item)}}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FieldGroup>}

              {cityData.length > 0 && 
              <FieldGroup>
                <FieldLabel htmlFor="country">City / Municipality</FieldLabel>
                <Select id="City" >
                  <SelectTrigger className="w-full">
                    <SelectValue  placeholder="Choose City" ref={cityRef}/>
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectGroup>
                      <SelectLabel>Choose City</SelectLabel>
                      {cityData.map((item,i) => (
                        <SelectItem key={`${item.stateCode}-${i}`} value={item.name} onClick={()=>{setCity(item)}}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </FieldGroup>}
            </FieldSet>

            <FieldGroup className='col-full mt-2'>
              <FieldLabel htmlFor="address-1" className="normal-case">Address Line 1: Floor / Building No. / House No. / Block / Lot</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="address-1"
                  name="address-1"
                  value={addressL1}
                  onChange={(e) => {
                    setAddressL1(e.target.value)
                    fixAddress();
                  }}
                  type="text"
                  aria-required="true"
                />
              </InputGroup>
            </FieldGroup>

            <FieldGroup className='col-full mt-2'>
              <FieldLabel htmlFor="address-2" className="normal-case">Address Line 2: Street / Village / Town</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="address-2"
                  name="address-2"
                  value={addressL2}
                  onChange={(e) => {
                    setAddressL2(e.target.value)
                    fixAddress();
                  }}
                  type="text"
                  aria-required="true"
                />
              </InputGroup>
            </FieldGroup>

            <FieldGroup className="grid mt-5 mb-0">
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
            </FieldGroup>
            <div className="divider-horizontal col-full"></div>
          </div>}

          <div className={clsx('field-group',{'error':fieldError(errors,'terms')})}>
            <div className='flex justify-end gap-5'>
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