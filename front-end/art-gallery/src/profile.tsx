import { use, useEffect, useState } from 'react';
import { getUserProfile } from '../api/userAPI.ts';
import type { UserProfile } from '../models/userProfile.ts';
import Topbar from '../components/topbar/topbar.tsx';

function profile() {

  const [data, setData] = useState<UserProfile | null>(null);

  async function fetchUserProfile() {
    try {
      const response = await getUserProfile();        // API call
      if (!response.ok) throw new Error("Fetch failed");
      const profileData = await response.json();
      console.log("Profile data:", profileData.user);
      setData(profileData.user);
    } catch (err) {
      console.error(err);
      setData(null);
    }
  }


  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  return data === null ? 
  <div>
    <Topbar/>
    <p>loading...</p>
  </div> : 
  <div>
    <Topbar/>
    <h1>{data.username}</h1>
    <p>Email: {data.email}</p>
    <p>First Name: {data.firstName}</p>
    <p>Last Name: {data.lastName}</p>
  </div>;
}

export default profile;