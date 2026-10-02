import { useLogin, useProfile, useUser, useErrors } from "@src/store/store";
import { Country, State } from "country-state-city";
import type {User} from '@src/fields/type';

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
  clearForm();
  useLogin.setState({isLogged:false});
  useLogin.setState({id:'',username:''});
  useProfile.setState({formType:'login'});
  localStorage.removeItem('setLogged')
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

export const checkLogged = (validUser:User | undefined) =>{
  const isLogged = localStorage.getItem('setLogged') ?? "";
  const loggedObj = isLogged !== "" && JSON.parse(isLogged);
  const now = new Date();
    
  if(loggedObj.username){
    useLogin.setState({id:loggedObj.id, username: loggedObj.username});
    if(validUser){
      const lastLogged = validUser?.logged && new Date(validUser?.logged);
      const timeDiff = lastLogged ? now.getTime() - lastLogged.getTime() : -1;
      const less24Hrs = timeDiff >= 0 && timeDiff <= 24 * 60 * 60 * 1000;
      if(less24Hrs){
        useProfile.setState({
          formType:'dashboard',
          id:validUser.id,
          username: validUser.username,
          password: validUser.password,
          firstname: validUser.firstname,
          lastname: validUser.lastname,
          mobile: validUser.mobile,
          email: validUser.email,
          address: [validUser.address],
          terms: true,
        })
        useLogin.setState({isLogged: true});
      }else{
        loggedOut();
      }
    }
  }else{
    loggedOut();
  }
}

export const profileIcon = (firstname:string, lastname:string) =>{
  const firstletter = ((firstname.toLowerCase().charCodeAt(0) - 96) - (lastname.toLowerCase().charCodeAt(0) - 96)) % 10;
  const colornumber = firstletter < 0 ? firstletter * -1 : firstletter === 0 ? 1 : firstletter;
  const pbg = `profile-color-${colornumber}`;

  return <span  className={`profile-icon ${pbg}`}>
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