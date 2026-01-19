import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { UserContextAuth } from "../models/userContextAuth.ts";
import type { UserProfile } from "../models/userProfile.ts";
import { getUserProfile, postUserLogin } from "../api/userAPI.ts";

type Props = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextAuth>({} as UserContextAuth);

export const UserAuthProvider = ({ children }: Props) => {

  const [user, setUser] = useState<UserProfile | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  async function loginUser ( 
    email: string,
    password: string 
  ): Promise<{isSucessful: boolean, message: string}> {
    // Logic to log in the user and set the user state
    try {
      const userLoginRes = await postUserLogin({ email, password });
      if (userLoginRes.ok) { // login successful
        const userProfileRes = await getUserProfile();
        if (userProfileRes.ok) { // fetch profile successful
          const dataJson = await userProfileRes.json();
          const data = dataJson as { user: UserProfile };
          setUser(data.user);
          console.log("User logged in:", dataJson.user);
          return {isSucessful: true, message: "Login successful"};
        } else {
          console.error("Failed to fetch user profile after login");
          return {isSucessful: false, message: `Failed to fetch profile: ${userProfileRes.status}`};
        }
      } else {
        console.error("Login failed");
        return {isSucessful: false, message: `Login failed: ${userLoginRes.status}`};
      }
    } catch(e) {
      console.error("Error during login:", e);
      return {isSucessful: false, message: `Error during login:`};
    };
  }

  function logoutUser() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

