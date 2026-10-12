import { useLogin, useProfile, useUser, useErrors } from "@src/store/store";
import { Country, State } from "country-state-city";

export const clearForm = () => {
  // useLogin.setState({username:''});
  useProfile.setState({
    username:'',
    password:'',
    firstname:'',
    lastname:'',
    mobile:'',
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
    username:'',
    password:'',
    firstname:'',
    lastname:'',
    mobile:'',
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
  localStorage.removeItem('setLogged');
  window.location.reload();
}

export const setLoggedUser = (
  id:string,
  username:string
) =>{
  console.log(id)
  const toLocal = {
    'id':id,
    'username':username,  
    'datetime':new Date()
  }
  localStorage.setItem('setLogged',JSON.stringify(toLocal));
  useLogin.setState({id:id,username:username});
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