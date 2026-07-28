import './login.css';
import { useLogin } from "@src/store/store";

const Login = () => {
  const setLogin = useLogin((state:any) => state.setLogin);
  const setUsername = useLogin((state:any) => state.setUsername);
  const setPassword = useLogin((state:any) => state.setPassword);
  
  

  return (
    <div className="login-container">
      <form className="login-form">
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username:</label>
          <input 
            id="username" 
            type="text" 
            aria-required="true" 
            aria-invalid="false" 
            aria-label="Username" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password:</label>
          <input 
            id="password" 
            type="password" 
            aria-required="true" 
            aria-invalid="false" 
            aria-label="Password" />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  )
}
export default Login;