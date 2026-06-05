// login user
async function postUserLogin(formData: { email: string; password: string; }) {
    try {
        if (!formData.email || !formData.password) {
            console.log("Email or password missing");
            throw new Error("Email and password are required");
        }

        const res = await fetch("http://localhost:5000/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
            credentials: "include"
        });
        return res;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}

// get authenticated user's profile
async function getUserProfile () {
    try {
        const res = await fetch("http://localhost:5000/users/profile", {
            credentials: "include"
        });
        return res;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

// send password reset link to user's email
async function sendResetLink(email: string) {
    try {
        if (!email) {
            console.log("Email missing");
            throw new Error("Email is required");
        }

        const res = await fetch("http://localhost:5000/users/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email }),
            credentials: "include"
        });
        return res;
    } catch (error) {
        console.error("Error sending reset link:", error);
        throw error;
    }
}

// reset password using token from email link
async function resetPassword(token: string, newPassword: string) {
    console.log("Trying to reset password with token:", token);
    try {
        if (!token || !newPassword) {
            console.log("Token or new password missing");
            throw new Error("Token and new password are required");
        }

        const res = await fetch(`http://localhost:5000/users/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password: newPassword, token: token }),
            credentials: "include"
        });
        return res;
    } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
    }
}

export { getUserProfile, postUserLogin, sendResetLink, resetPassword };
