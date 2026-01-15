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

// check if user is authenticated
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

export { getUserProfile, postUserLogin };
