import { useLogin, useProfile, useErrors } from "@src/store/store";
import type {User} from '@src/fields/type';

export const clearForm = () => {
  useLogin.setState({username:''});
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

export const loggedOut = () => {
  clearForm();
  useLogin.setState({isLogged:false});
  useProfile.setState({formType:''});
  localStorage.removeItem('setLogged')
}

export const checkLogged = (validUser:User | undefined) =>{
  const isLogged = localStorage.getItem('setLogged') ?? "";
  const loggedObj = isLogged !== "" && JSON.parse(isLogged);
  const now = new Date();
    
  if(loggedObj.username){
    useLogin.setState({username: loggedObj.username});
    if(validUser){
      const lastLogged = validUser?.logged && new Date(validUser?.logged);
      const timeDiff = lastLogged ? now.getTime() - lastLogged.getTime() : -1;
      const less24Hrs = timeDiff >= 0 && timeDiff <= 24 * 60 * 60 * 1000;
      if(less24Hrs){
        useProfile.setState({
          formType:'dashboard',
          username: validUser.username,
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