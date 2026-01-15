import { createContext, useState } from "react";
import type { ReactNode } from "react";

import type { UserContextAuth } from "../models/userContextAuth.ts";
import type { UserProfile } from "../models/userProfile.ts";

type Props = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextAuth>({} as UserContextAuth);

export const UserAuthProvider = ({ children }: Props) => {

  const [user, setUser] = useState<UserProfile | null>(null);

  function loginUser() {
    // Logic to log in the user and set the user state

  } 

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

