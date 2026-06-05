import './forgotPassword.css';
import Topbar from '../components/topbar/topbar';

import { useState } from 'react';
import { sendResetLink } from '../api/userAPI';
import { toast, ToastContainer } from 'react-toastify';

function ForgotPassword() {

    const [email, setEmail] = useState("");

    // handle form submission
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // prevents page navigation
        await sendResetLink(email); //send reset link to user's email
        toast.success('Reset link sent! Please check your email.', {
            position: 'bottom-center',
            autoClose: 3000,
        });
    };

    return (
        <div>
            <Topbar />
            <form className="forgot-password-form" onSubmit={handleSubmit}>
                <h1>Forgot Password</h1>
                <input name="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit">Send Reset Link</button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default ForgotPassword;