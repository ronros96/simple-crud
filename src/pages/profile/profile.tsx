import './profile.css';
//types
import type { User } from '@src/fields/type';
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
import { Spinner } from "@components/ui/spinner"
import BackCancel from '@components/back_cancel/backCancel';
import DeleteUser from "@components/delete_user/deleteUser";
import { Eye, EyeOff } from "lucide-react"
//state
import { useErrors, useProfile, useUser, useLogin, useUserUpdated } from "@src/store/store";
// helpers
import { checkAllFields, showRequirements, fieldError, FieldOrginizer } from "@src/lib/helpers/field";
import { ProfileFields } from "@src/fields/profile";
import { clearUser, fixContact } from "@lib/helpers/user";
import { useRoute } from "@lib/helpers/routes";
//hooks
import { usePutUser, useCreateUser, useGetUser, useGetUsers } from '@hooks/Profile';


const Profile = () => {
  //Init
  const { id } = useParams();
  const UserPicked = useUser((state: any) => state.UserPicked);
  const setUserPicked = useUser((state: any) => state.setUserPicked);
  const { data: userFound } = useGetUser({ id: id });
  const { data: allUsers } = useGetUsers();
  //global state form type
  const formType = useProfile((state: any) => state.formType);
  const setFormType = useProfile((state: any) => state.setFormType);

  //update / register
  const newProfile = ['sign-in', 'new-user'];
  const updateProfile = ['update-profile', 'update-user'];
  //state
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  //global state fields
  const userID = id !== null ? id : UserPicked.userID;
  const username = UserPicked.username ?? userFound?.username ?? '';
  const password = UserPicked.password ?? userFound?.password ?? '';
  const firstname = UserPicked.firstname ?? userFound?.firstname ?? '';
  const lastname = UserPicked.lastname ?? userFound?.lastname ?? '';
  const contact = UserPicked.contact ?? userFound?.contact ?? '';
  const email = UserPicked.email ?? userFound?.email ?? '';
  const address = UserPicked.address ?? userFound?.address ?? '';
  const terms = UserPicked.terms ?? userFound?.id ? true : false;
  const [init, setInit] = useState(false);
  const [contactNum, setContactNum] = useState(fixContact(contact, address)[0]);
  const [contactLoc, setContactLoc] = useState(fixContact(contact, address)[1]);
  const [credUpdate, setCredUpdate] = useState(false);

  //users
  const setUsers = useUser((state: any) => state.setUsers);
  //address
  let countryData = Country.getAllCountries();
  const [stateData, setStateData] = useState<IState[]>([]);
  const [cityData, setCityData] = useState<ICity[]>([]);
  const [country, setCountry] = useState<ICountry | null>(null);
  const [state, setState] = useState<IState | null>(null);
  const [city, setCity] = useState<ICity | null>(null);
  const [addressL1, setAddressL1] = useState("");
  const [addressL2, setAddressL2] = useState("");
  //global state logged
  const isLogged = useLogin((state: any) => state.isLogged);
  //global state errors
  const errors = useErrors((state: any) => state.errors);
  const setErrors = useErrors((state: any) => state.setErrors);
  const countryRef = useRef<HTMLElement | null>(null);
  const stateRef = useRef<HTMLElement | null>(null);
  const cityRef = useRef<HTMLElement | null>(null);
  //Notification state
  const setProfileUpdate = useUserUpdated((state: any) => state.setProfileUpdate);
  const setUpdatedUserID = useUserUpdated((state: any) => state.setUpdatedUserID);
  //navigation
  const { toSuccess, toDashboard } = useRoute();

  const setTitle = () => {
    if (formType === 'sign-in')
      return 'Sign-in';
    if (formType === 'new-user')
      return 'New User';
    if (updateProfile.includes(formType))
      return 'Update';
    if (!updateProfile.includes(formType) && !newProfile.includes(formType))
      return <span className='flex items-center gap-[var(--gap)]'>Closing <Spinner className="size-6" /></span>;
  }

  const setContact = () => {
    setUserPicked({ contact: `${contactNum} x${contactLoc}` })
  }

  const loadAddress = () => {
    if (Array.isArray(address)) {
      const currentCountry = Country.getCountryByCode(address[0]);
      setCountry(currentCountry ?? null);

      const currentState = State.getStateByCodeAndCountry(address[1], address[0])
      setState(currentState ?? null);

      const cityData = City.getCitiesOfState(address[0], address[1]);
      const currentCity = cityData.find(city => city.name === address[2]);
      setCity(currentCity ?? null);
      setAddressL1(address[3] ?? "");
      setAddressL2(address[4] ?? "");
    }
  }

  const setAddress = () => {
    let addInputs = [];
    if (country === null) {
      addInputs.push("-country-");
    } else {
      country && addInputs.push(country.isoCode);
    }
    if (stateData.length > 0 && state === null) {
      addInputs.push("-state-");
    } else {
      state && addInputs.push(state.isoCode);
    }

    if (cityData.length > 0 && city === null) {
      addInputs.push("-city-");
    } else {
      city && addInputs.push(city.name);
    }

    if (addressL1 === "") {
      addInputs.push("-addressline-");
    } else {
      addInputs.push(addressL1);
      addInputs.push(addressL2)
    }
    setUserPicked({ address: addInputs });
  }

  const createUser = useCreateUser();
  const updateUser = usePutUser();

  const showToastError = (message: string) => {
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

  const submitForm = async (e: any) => {
    e.preventDefault;
    //selected fields to be submitted.
    const state = {
      username,
      password,
      firstname,
      lastname,
      contact,
      email,
      address,
      terms
    }
    //insert state values to ProfileFields value
    setAddress();
    const fields = Object.fromEntries(
      Object.entries(ProfileFields).map(([key, field]) => [
        key,
        {
          ...field,
          value: state[key as keyof typeof state],
        },
      ])
    );
    const result = checkAllFields(fields, 'trigger');
    setErrors([]);

    if (Object.values(result).every(value => value === "good")) {
      setSaving(true);
      if (newProfile.includes(formType)) {
        try {
          await createUser.mutateAsync({
            id: userID,
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            contact: contact,
            email: email,
            address: address,
            logged: new Date(),
            bot: false,
          });
          clearUser();
          setFormType('created');
          toSuccess();
        } catch (error: any) {
          showToastError(error.message);
        }
      } else {
        try {
          await updateUser.mutateAsync({
            id: userID,
            user: {
              id: userID,
              username: username,
              password: password,
              firstname: firstname,
              lastname: lastname,
              contact: contact,
              email: email,
              address: address,
              logged: new Date(),
            }
          });
          clearUser();
          setProfileUpdate(true);
          setUpdatedUserID(userID);
          if (credUpdate) {
            setFormType('success');
            toSuccess();
          } else {
            setFormType('dashboard');
            toDashboard();
          }
        } catch (error: any) {
          showToastError(error.message);
        }
      }
    } else {
      setErrors(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  const filteredUsers = useMemo(
    () => allUsers?.filter((user: User) => !(user.id === id)) ?? [],
    [allUsers]
  );

  useEffect(() => {
    if (!init && Array.isArray(address) && contact !== '') {
      setContactNum(fixContact(contact, address)[0]);
      setContactLoc(fixContact(contact, address)[1]);
      loadAddress();
      setInit(true);
    }
  }, [userFound, contact, init])

  //setUsers to check username uniqueness.
  useEffect(() => {
    if (id) {
      setUsers(filteredUsers);
      setUserPicked({ userID: id });
    } else {
      setUsers(allUsers);
    }
  }, [allUsers]);

  useEffect(() => {
    if (country) {
      setStateData(State.getStatesOfCountry(country?.isoCode));
      setCityData([])
    }
  }, [country]);

  useEffect(() => {
    if (country && state) {
      setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
    }
  }, [state]);

  useEffect(() => {
    if (init) {
      setAddress()
    }
  }, [country, state, city, addressL1, addressL2])

  useEffect(() => {
    if (init) {
      setContact()
    }
  }, [contactLoc, contactNum])

  return (UserPicked && formType !== '' &&
    <section className={
      clsx('container',
        {
          'header-margin': isLogged,
          'header-space': formType === 'sign-in',
          'saving': saving,
        })
    }>
      <title>{`${import.meta.env.VITE_APP_TITLE} | Sign-In`}</title>
      <h1 className='header-4'>{setTitle()}</h1>
      <div className='divider-horizontal'></div>
      <div className="important">
        <strong>* Required</strong><br />
        <p className={clsx('err-msg', { 'show': Object.values(errors).some(value => value !== 'good') })}>
          Please fill in all required fields and check the requirements.
        </p>
        <p className={clsx('err-msg', { 'show': Object.values(errors).some(value => value === 'exist') })}>
          Username already exist, please choose another username.
        </p>
      </div>
      <form action={submitForm}>
        <div className="profile-container">
          <div className="profile-form">
            <p className='col-full'>
              <strong>Please make sure to follow certain requirements on creating this account.</strong><br />
              <strong>This is for Demo purposes only, please refrain to use real information, and be wholesome &#128522;</strong>
            </p>

            {FieldOrginizer(ProfileFields, 'username') &&
              <Field className={clsx('form-group', { 'error': fieldError(errors, 'username') })}>
                <FieldLabel htmlFor="username">Username<span className="important">*</span>:</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="username"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => {
                      setCredUpdate(formType === 'update-profile' ? true : false)
                      setUserPicked({ username: e.target.value })
                    }}
                    aria-required="true"
                  />
                </InputGroup>
                {showRequirements(
                  ProfileFields.username,
                  username,
                  {
                    display: "init",
                    insert: ["You can only use period / underscore ( . _ ) for spacing"],
                    unique: "profile",
                  }
                )}
              </Field>}

            {FieldOrginizer(ProfileFields, 'password') &&
              <Field className={clsx('form-group', { 'error': fieldError(errors, 'password') })}>
                <FieldLabel htmlFor="password">Password<span className="important">*</span>:</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setCredUpdate(formType === 'update-profile' ? true : false)
                      setUserPicked({ password: e.target.value })
                    }}
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
                    display: "init",
                  }
                )}
              </Field>}
            <div className="divider-horizontal col-full"></div>
          </div>

          <div className="profile-form">

            {FieldOrginizer(ProfileFields, 'firstname') &&
              <Field className={clsx('form-group', { 'error': fieldError(errors, 'firstname') })}>
                <FieldLabel htmlFor="firstname">First Name<span className="important">*</span>:</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="firstname"
                    name="firstname"
                    value={firstname}
                    onChange={(e) => setUserPicked({ firstname: e.target.value })}
                    type="text"
                    aria-required="true"
                  />
                </InputGroup>
              </Field>}

            {FieldOrginizer(ProfileFields, 'lastname') &&
              <Field className={clsx('form-group', { 'error': fieldError(errors, 'lastname') })}>
                <FieldLabel htmlFor="lastname">Last Name<span className="important">*</span>:</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="lastname"
                    name="lastname"
                    value={lastname}
                    onChange={(e) => setUserPicked({ lastname: e.target.value })}
                    type="text"
                    aria-required="true"
                  />
                </InputGroup>
              </Field>}

            {FieldOrginizer(ProfileFields, 'contact') &&
              <Field className={clsx('form-group contact', { 'error': fieldError(errors, 'contact') })}>
                <FieldLabel htmlFor="contact">Contact Number<span className="important">*</span>:</FieldLabel>
                <InputGroup>
                  <PhoneInput
                    id="contact"
                    name="contact"
                    value={contactNum}
                    onChange={(value) => {
                      setContactNum(value)
                      setContact;
                    }}
                    type="text"
                    aria-required="true"
                  />
                  <FieldLabel className='local-label' htmlFor="local">Local :</FieldLabel>
                  <InputGroupInput
                    id="local"
                    name="local"
                    value={contactLoc}
                    onChange={(e: any) => {
                      setContactLoc(e.target.value);
                      setContact;
                    }}
                    type="number"
                    aria-required="false"
                  />
                </InputGroup>
              </Field>}

            {FieldOrginizer(ProfileFields, 'email') &&
              <Field className={clsx('form-group', { 'error': fieldError(errors, 'email') })}>
                <FieldLabel htmlFor="email">Email Address<span className="important">*</span>:</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setUserPicked({ email: e.target.value })}
                    type="text"
                    aria-required="true"
                  />
                </InputGroup>
                {showRequirements(
                  ProfileFields.email,
                  email,
                  {
                    display: "trigger"
                  })}
              </Field>}
          </div>

          {FieldOrginizer(ProfileFields, 'address') &&
            <div className={clsx('profile-form', { 'error': fieldError(errors, 'address') })}>
              <FieldSet className={clsx('md:grid grid-cols-3 col-full', { 'error': fieldError(errors, 'address') })}>
                <FieldLegend>Residential Address<span className="important">*</span>:<br />
                  {showRequirements(
                    ProfileFields.address,
                    address,
                    {
                      display: fieldError(errors, 'address') ? "trigger" : "none"
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
                        setState(null);
                        setCity(null)
                      }
                    }}
                  >
                    <SelectTrigger className="w-full" >
                      <SelectValue placeholder="Choose Country" ref={countryRef} />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      <SelectGroup>
                        <SelectLabel>Choose Country</SelectLabel>
                        {countryData.map((item, i) => (
                          <SelectItem key={`${item.isoCode}-${i}`} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FieldGroup>

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
                        setCity(null)
                      }
                    }}
                    disabled={stateData.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={stateData.length === 0 ? 'Choose Country first' : 'Choose State'} ref={stateRef} />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      <SelectGroup>
                        <SelectLabel>Choose State</SelectLabel>
                        {stateData.map((item, i) => (
                          <SelectItem key={`${item.isoCode}-${i}`} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FieldGroup>

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
                      }
                    }}
                    disabled={cityData.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={cityData.length === 0 ? 'Choose State first' : 'Choose City'} ref={cityRef} />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      <SelectGroup>
                        <SelectLabel>Choose City</SelectLabel>
                        {cityData.map((item, i) => (
                          <SelectItem key={`${item.stateCode}-${i}`} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FieldGroup>
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
                    }}
                    type="text"
                    aria-required="true"
                    autoComplete="new-address"
                  />
                </InputGroup>
              </FieldGroup>
            </div>}

          {FieldOrginizer(ProfileFields, 'terms') &&
            <div className={clsx('profile-form ', { 'error': fieldError(errors, 'terms') })}>
              <FieldGroup className="grid mt-5 mb-0 col-full">
                <Field orientation="horizontal">
                  <Checkbox
                    id="terms"
                    name="terms"
                    title="Terms and Condition"
                    checked={terms}
                    onCheckedChange={(value) => {
                      setUserPicked({
                        ...UserPicked,
                        terms: value === true,
                      });
                    }}
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
                            <img src={`${import.meta.env.BASE_URL}meme-1.png`} />
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
                      title: "Terms and Condition",
                      display: fieldError(errors, 'terms') ? "trigger" : "init"
                    }
                  )}
                </Field>
              </FieldGroup>
              <div className="divider-horizontal col-full"></div>
            </div>}

          {!updateProfile.includes(formType) && !newProfile.includes(formType) ?
            <div className='flex items-center justify-end gap-[var(--gap)]'>Closing <Spinner /></div> :
            <div className={clsx('field-group', { 'error': fieldError(errors, 'terms') })}>
              <div className='flex justify-between gap-5'>
                {formType === "update-user" && <DeleteUser variant="stroke" />}
                <div className='flex gap-5 flex-[1_0_auto] justify-end'>
                  <Button type="submit">
                    {newProfile.includes(formType) ? 'Register' : 'Update'}
                  </Button>
                  <BackCancel />
                </div>
              </div>
            </div>
          }
        </div>
      </form>
      
      <Toaster />
    </section>
  )
}
export default Profile;