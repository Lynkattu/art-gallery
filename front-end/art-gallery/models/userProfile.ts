export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;  // optional / nullable
  userIcon: string | null;  // optional / nullable
}