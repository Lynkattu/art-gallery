import './userRegister.css';
import { useState } from "react";

function UserRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
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
    const response = await fetch("http://127.0.0.1:5000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Registration success", data);
      // stay on page or navigate manually
    } else {
      console.error("Registration failed", data);
    }
  };

  return (
    <form className="registerform" onSubmit={handleSubmit}>
      <ul>
        <li>
          <input name="firstName" onChange={handleChange} placeholder='Enter first name'/>
        </li>
        <li>
          <input name="lastName" onChange={handleChange} placeholder='Enter last name'/>
        </li>
        <li>
          <input name="username" onChange={handleChange} placeholder='Enter username'/>
        </li>
        <li>
          <input name="email" type="email" onChange={handleChange} placeholder='Enter email' />
        </li>
        <li>
          <input name="password" type="password" onChange={handleChange} placeholder='Enter password' />
        </li>
        <li>
          <button type="submit">Submit</button>
        </li>
      </ul>
    </form>
  );
}

export default UserRegister;
