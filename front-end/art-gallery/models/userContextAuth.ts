import type { UserProfile } from "./userProfile.ts";

export interface UserContextAuth {
  //isLoggedin: () => boolean;
  user: UserProfile | null;
}