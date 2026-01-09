import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './home';
import UserRegister from './userRegister';
import Login from './login';
import Profile from './profile';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="profile" element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;