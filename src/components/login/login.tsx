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
          <label className="form-label" htmlFor="username">Username</label>
          <input 
            id="username" 
            type="text" 
            aria-required="true" 
            aria-invalid="false" 
            aria-label="Username" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input 
            id="password" 
            type="password" 
            aria-required="true" 
            aria-invalid="false" 
            aria-label="Password" />
        </div>

        <a href="#" className="forgot-password">Forgot Password?</a>

        <div className="form-group grid grid-cols-2">
          <button type="submit">Login</button>
          <button className="stroke">Cancel</button>
        </div>
      </form>
      <div className="divider-vertical"></div>
      <div className="login-content">
        <h2 className="header-5">Hello There!</h2>
        <p>This is a simple <strong>Library Catalogue System</strong>. Just to show how I develop CRUD type system using React JS.</p>
        <p><strong>
          If you want to enter as an Admin<br/>
          Username: Admin<br/>
          Password: admin<br/>
        </strong></p>
        <p><strong>
          If you want to enter as an Librarian<br/>
          Username: Librarian<br/>
          Password: books<br/>
        </strong></p>
        <p><strong>
          To be a Patron click SIGN-IN<br/>
        </strong></p>
        <button>Sign In</button>
      </div>
    </div>
  )
}
export default Login;