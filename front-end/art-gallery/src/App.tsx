import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserAuthProvider } from '../contexts/userContext.tsx';
import Home from './home';
import UserRegister from './userRegister';
import Login from './login';
import Profile from './profile';
import PersonalArt from './PersonalArt';
import Art from './art';


function App() {

  return (
    <UserAuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arts" element={<Home />} />
        <Route path="/art/:id" element={<Art />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/personal-art" element={<PersonalArt/>} />
      </Routes>
    </BrowserRouter>
    </UserAuthProvider>
  )
}

export default App;