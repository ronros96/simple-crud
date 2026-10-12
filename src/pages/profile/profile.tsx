import './profile.css';
import clsx from 'clsx';
import { useParams } from 'react-router';
import { useEffect, useState, useRef, useMemo } from "react";
import { City, Country, State } from "country-state-city";
import type { ICountry, IState, ICity } from "country-state-city";
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
import { toast, Toaster } from "@components/ui/toast"
import BackCancel from '@components/back_cancel/backCancel';

import { Eye, EyeOff } from "lucide-react"
//state
import { useErrors, useProfile, useUser, useLogin } from "@src/store/store";
// helpers
import {checkAllFields, showRequirements, fieldError, FieldOrginizer} from "@src/lib/helpers/field";
import { ProfileFields } from "@src/fields/profile";
import { setLoggedUser } from "@lib/helpers/user";
import { useRoute } from "@lib/helpers/routes";
//hooks
import { usePutUser, useCreateUser, useGetUser } from '@hooks/Profile';

const Profile = () => {
  //get ID
  const { id } = useParams();
  const UserPicked = useUser((state:any) => state.UserPicked);
  const setUserPicked = useUser((state:any) => state.setUserPicked);
  const {data: userFound} = useGetUser({id:id});

  useEffect(()=>{
    if(id && userFound){
      setFormType('update-user')
      setUserPicked(userFound);
      //remove user from users
      
    }
    unloadAddress();
  },[userFound,UserPicked])

  //update / register
  const newProfile = ['sign-in','new-user'];
  const updateProfile = ['update-profile','update-user'];
  //state
  const [showPassword, setShowPassword] = useState(false);
  //global state form type
  const formType = useProfile((state:any) => state.formType);
  const setFormType = useProfile((state:any) => state.setFormType);
  //global state fields
  const userID = id !== null ? id : UserPicked && UserPicked.id;
  const username = (UserPicked && UserPicked.username) ?? '';
  const password = (UserPicked && UserPicked.password) ?? '';
  const firstname = (UserPicked && UserPicked.firstname) ?? '';
  const lastname = (UserPicked && UserPicked.lastname) ?? '';
  const mobile =( UserPicked && UserPicked.mobile) ?? '';
  const email = (UserPicked && UserPicked.email) ?? '';
  const address = (UserPicked && UserPicked.address) ?? '';
  const terms = (UserPicked && UserPicked.terms) ?? false;
  const active = (UserPicked && UserPicked.active)?? false;
 
  //address
  let countryData = Country.getAllCountries();
  const [stateData, setStateData] = useState<IState[]>([]);
  const [cityData, setCityData] = useState<ICity[]>([]);
  const [country, setCountry] = useState<ICountry | null>(null);
  const [state, setState] = useState<IState | null>(null);
  const [city, setCity] = useState<ICity | null>(null); 
  const [addressL1,setAddressL1] =  useState("");
  const [addressL2,setAddressL2] =  useState("");
  //global state logged
  const isLogged =  useLogin((state:any) => state.isLogged);
  //global state errors
  const errors = useErrors((state:any) => state.errors);
  const setErrors = useErrors((state:any) => state.setErrors);
  const countryRef = useRef<HTMLElement | null>(null);
  const stateRef = useRef<HTMLElement | null>(null);
  const cityRef = useRef<HTMLElement | null>(null);
  //navigation
  const { toSuccess } = useRoute();
  

  const setTitle = () =>{
    if(formType === 'sign-in') 
      return 'Sign-in';
    if(formType === 'new-user') 
      return 'New User';
    if(updateProfile.includes(formType))
       return 'Update';
    if(!updateProfile.includes(formType) && !newProfile.includes(formType))
      return <span>Closing...</span>;
  }

  const unloadAddress = () =>{
    const currentAddress = address[0];
    if(Array.isArray(currentAddress)){
      const currentCountry = Country.getCountryByCode(currentAddress[0]);
      currentCountry !== undefined && setCountry(currentCountry);
      
      const currentState = State.getStateByCodeAndCountry(currentAddress[1],currentAddress[0])
      currentState !== undefined && setState(currentState);

      const cityData = City.getCitiesOfState(currentAddress[0],currentAddress[1]);
      const currentCity = cityData.find(city => city.name === currentAddress[2]);
      currentCity !== undefined && setCity(currentCity);
      currentAddress[3] !== undefined && setAddressL1(currentAddress[3]); 
      currentAddress[4] !== undefined && setAddressL2(currentAddress[4]); 
    }
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
      addInputs.push(addressL1);
      addInputs.push(addressL2)
    }
    setUserPicked({address: addInputs});
  }

  const createUser = useCreateUser();
  const updateUser = usePutUser();

  const showToastError = (message:string) => {
    const id = toast.add({
      title: "Error",
      description: message,
      actionProps: {
        children: "Ok",
        onClick() {
          toast.close(id)
        },
      },
    })
  }
  
  const submitForm = async (e:any) =>{
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
      if(newProfile.includes(formType)){
        try {
          await createUser.mutateAsync({
            id:userID,
            username:username,
            password:password,
            firstname:firstname,
            lastname:lastname,
            mobile:mobile,
            email:email,
            address:address,
            logged: new Date(),
          });
          // setLogin(true);
          // setFormType('dashboard');
          // setLoggedUser(userID,username);
          toSuccess();
        }catch (error:any) {
          showToastError(error.message);
        }
      }else{
        try{
          await updateUser.mutateAsync({
            id:userID,
            user:{
              id:userID,
              username:username,
              password:password,
              firstname:firstname,
              lastname:lastname,
              mobile:mobile,
              email:email,
              address:address,
              logged: new Date()
            }
          });
          if(formType === 'update-profile'){
            setLoggedUser(userID,username)
          }
        }catch (error:any) {
          showToastError(error.message);
        }
      }
    }else{
      setErrors(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

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

  return ( UserPicked &&
    <section className={
      clsx('container',
        {
          'header-margin':isLogged,
          'header-space':formType === 'sign-in',
        })
      }>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Sign-In`}</title>
      <h1 className='header-4'>{setTitle()}</h1>
      <div className='divider-horizontal'></div>
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
                    setUserPicked({username:e.target.value})
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
                  onChange={(e) => setUserPicked({password:e.target.value})}
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
                  onChange={(e) => setUserPicked({firstname:e.target.value})}
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
                  onChange={(e) => setUserPicked({lastname:e.target.value})}
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
                  value={mobile.replace(/[^\d+]/g, "")}
                  onChange={(value) => setUserPicked({mobile:value})}
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
                  onChange={(e) => setUserPicked({email:e.target.value})}
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
                <Select 
                  id="country" 
                  autoComplete="new-address" 
                  value={country?.name ?? ""}
                  onValueChange={(value) => {
                    const selected = countryData.find(
                      (item) => item.name === value
                    );
                    if (selected) {
                      setCountry(selected);
                      fixAddress()
                    }
                  }}
                >
                  <SelectTrigger className="w-full" >
                    <SelectValue placeholder="Choose Country" ref={countryRef}/>
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectGroup>
                      <SelectLabel>Choose Country</SelectLabel>
                      {countryData.map((item,i) => (
                        <SelectItem key={`${item.isoCode}-${i}`} value={item.name}>
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
                <Select 
                  id="State" 
                  autoComplete="new-address" 
                  value={state?.name ?? ""}
                  onValueChange={(value) => {
                    const selected = stateData.find(
                      (item) => item.name === value
                    );
                    if (selected) {
                      setState(selected);
                      fixAddress()
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue  placeholder="Choose State" ref={stateRef} />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectGroup>
                      <SelectLabel>Choose State</SelectLabel>
                      {stateData.map((item,i) => (
                        <SelectItem key={`${item.isoCode}-${i}`} value={item.name}>
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
                <Select 
                  id="City" 
                  autoComplete="new-address"  
                  value={city?.name ?? ""}
                  onValueChange={(value) => {
                    const selected = cityData.find(
                      (item) => item.name === value
                    );
                    if (selected) {
                      setCity(selected);
                      fixAddress()
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue  placeholder="Choose City" ref={cityRef}/>
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectGroup>
                      <SelectLabel>Choose City</SelectLabel>
                      {cityData.map((item,i) => (
                        <SelectItem key={`${item.stateCode}-${i}`} value={item.name}>
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
                    fixAddress()
                  }}
                  type="text"
                  aria-required="true"
                  autoComplete="new-address"
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
                    fixAddress()
                  }}
                  type="text"
                  aria-required="true"
                  autoComplete="new-address"
                />
              </InputGroup>
            </FieldGroup>
          </div>}
          
          {FieldOrginizer(ProfileFields,'terms') &&
          <div className={clsx('profile-form ',{'error':fieldError(errors,'terms')})}>
            <FieldGroup className="grid mt-5 mb-0 col-full">
              <Field orientation="horizontal">
                <Checkbox 
                  id="terms" 
                  name="terms"
                  title="Terms and Condition"
                  checked={terms}
                  onCheckedChange={(value) => setUserPicked({terms:!!value})}
                  aria-required="true"
                />
                <Label htmlFor="terms" className='normal text-base md:text-sm '>
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
              </Field>
            </FieldGroup>
            <div className="divider-horizontal col-full"></div>
          </div>}

          <div className={clsx('field-group',{'error':fieldError(errors,'terms')})}>
            <div className='flex justify-center lg:justify-end gap-5'>
              <Button type="submit">
                 {newProfile.includes(formType) && 'Register'}
                 {updateProfile.includes(formType) && 'Update'}
              </Button>
              <BackCancel/>
            </div>
          </div>
        </div>
      </form>
      <Toaster/>
    </section>
  )
}
export default Profile;