import './login.css';
import Topbar from '../components/topbar/topbar';

import { useState } from 'react';
import { sendResetLink } from '../api/userAPI';
import { toast, ToastContainer } from 'react-toastify';

function ResetPassword() {

    const [formData, setFormData] = useState({
        email: "",
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
        await sendResetLink(formData.email); //send reset link to user's email
        toast.success('Reset link sent! Please check your email.', {
            position: 'bottom-center',
            autoClose: 3000,
        });
    };

    return (
        <div>
            <Topbar />
            <form className="reset-password-form" onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                <input name="email" placeholder='Enter your email' value={formData.email} onChange={handleChange} />
                <button type="submit">Send Reset Link</button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default ResetPassword;