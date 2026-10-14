import { useProfile, useUser, useErrors } from "@src/store/store";
import { Country, State } from "country-state-city";
import { removeAuthCookie } from '@hooks/logs';

export const clearForm = () => {
  useProfile.setState({
    username:'',
    password:'',
    firstname:'',
    lastname:'',
    contact:'',
    email:'',
    address:[],
    terms:false,
    booklimit:0,
    role:0,
    active: false,
  });
  useErrors.setState({errors: []})
}

export const clearUser = () => {
  useUser.setState({
    UserPicked:{},
    username:'',
    password:'',
    firstname:'',
    lastname:'',
    contact:'',
    email:'',
    address:[],
    terms:false,
    booklimit:0,
    role:0,
    active: false,
  });
  useErrors.setState({errors: []})
}

export const loggedOut = () => {
  removeAuthCookie();
  window.location.reload();
}

export const profileIcon = (
  firstname:string,
  lastname:string,
  order?:number,
) =>{
  const nameMod = ((firstname.toLowerCase().charCodeAt(0) - 96) - (lastname.toLowerCase().charCodeAt(0) - 96)) % 7;
  const colornumber = nameMod < 0 ? 
        nameMod * -1 : 
        nameMod === 0 ? (firstname.toLowerCase().charCodeAt(0) - 96) % 7 : 
        nameMod;
  const colorBG = `profile-color-${colornumber}`;

  return <span key={`${firstname}-${lastname}`} className={`profile-icon ${colorBG}`} data-order={order ?? 0}>
    {firstname[0]}{lastname[0]}
  </span>
}

export const fixAddress = (address:string[]) =>{
  const country = Country.getCountryByCode(address[0]);
  const state = State.getStateByCodeAndCountry(address[0],address[1]) !== undefined ? 
    State.getStateByCodeAndCountry(address[0],address[1]): 
    {name:''};
  const stateDisplay = state?.name !== '' ? `${state?.name},`:''; 
  return `${address[3]}, ${address[4]}, ${address[2]}, ${stateDisplay} ${country?.name}`;
}

export const fixContact = (
  contact:string,
  countryCode: undefined | string[]
) =>{
  const number = contact.split('x');
  const actualNum = number[0].replace(/[().\-\s]/g, "")
  const localNum = number[1] ? number[1] : '';
  const countryNum = countryCode !== undefined ? !actualNum.startsWith('+') ? Country.getCountryByCode(countryCode[0])?.phonecode : '' : '';
  const countryNumPlus = countryNum !== '' && countryNum !== undefined ? countryNum?.startsWith('+') ? `${countryNum}` : `+${countryNum}` : '';
  return [`${countryNumPlus}${actualNum}`,localNum]; 
}