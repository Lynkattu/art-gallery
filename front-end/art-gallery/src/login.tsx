import './login.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import Topbar from '../components/topbar/topbar';
import { postUserLogin } from '../api/userAPI.ts';

function Login() {
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
    // send formData to backend
    const res = await postUserLogin(formData);
    const data = await res.json();

    if (res.ok) {
      console.log("Login success", data);
      navigate('/');
    } else {
      console.error("Login failed", data);
    }
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
  </div>;
}
export default Login;