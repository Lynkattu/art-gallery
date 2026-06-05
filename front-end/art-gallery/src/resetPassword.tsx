import "./resetPassword.css";
import Topbar from '../components/topbar/topbar';
import { useParams } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../api/userAPI";


function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // send new password and token to backend to reset password
        if (token) {
            await resetPassword(token, password);
        }
    }

    return (
        <div>
            <Topbar />
            <form className="reset-password-form" onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                <input 
                    name="password" 
                    type="password" 
                    placeholder='Enter new password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Change Password</button>
            </form>
        </div>
    )
}

export default ResetPassword;