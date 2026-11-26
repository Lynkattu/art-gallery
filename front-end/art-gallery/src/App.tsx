import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserAuthProvider, UserContext } from '../contexts/userContext.tsx';
import Home from './home';
import UserRegister from './userRegister';
import Login from './login';
import Profile from './profile';
import PersonalArt from './PersonalArt';
import Art from './art';
import ResetPassword from './resetPassword.tsx';
import ForgotPassword from './forgotPassword.tsx';
import { useContext, type ReactNode } from 'react';


function App() {
  
  function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user } = useContext(UserContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

  return (
    <UserAuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arts" element={<Home />} />
        <Route path="/art/:id" element={<Art />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/personal-art" element={<ProtectedRoute><PersonalArt/></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
      </Routes>
    </BrowserRouter>
    </UserAuthProvider>
  )
}

export default App;