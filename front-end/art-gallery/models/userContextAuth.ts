import type { UserProfile } from "./userProfile.ts";

export interface UserContextAuth {
  //isLoggedin: () => boolean;
  loginUser: (email: string, password: string) => Promise<{isSucessful: boolean, message: string}>;
  logoutUser: () => void;
  user: UserProfile | null;
}