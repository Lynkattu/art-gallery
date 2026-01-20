import './login.css';
import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { UserContext } from '../contexts/userContext.tsx';

import Topbar from '../components/topbar/topbar';

function Login() {
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // handle input changes for all fields
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // prevents page navigation
    const loginUserRes = await loginUser(formData.email, formData.password); // login user using context
    // if login failed, show error toast
    if (!loginUserRes.isSucessful) {
      toast.error(`Login failed: ${loginUserRes.message}`, {
        position: 'bottom-center',
        autoClose: 3000,
      });
      return;
    }

    navigate('/'); // redirect to home page after login
  };

  return <div>
    <Topbar/>
    <h1>Login</h1>
    <form className="loginform" onSubmit={handleSubmit}>
      <ul>
        <li>
          <input name="email" placeholder='Enter email' onChange={handleChange} />
        </li>
        <li>
          <input name="password" type="password" placeholder='Enter password' onChange={handleChange} />
        </li>
        <li>
          <button type="submit">Login</button>
        </li>
      </ul>
    </form>
    <ToastContainer />
  </div>;
}
export default Login;