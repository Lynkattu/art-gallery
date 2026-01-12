import { use, useEffect, useState } from 'react';
import {getProfile} from '../api/requests/artAPI.ts';
import type {UserProfile} from '../api/models/userProfile.ts';
import Topbar from '../components/topbar/topbar.tsx';

function profile() {

  const [data, setData] = useState<UserProfile | null>(null);

  async function getUserProfile() {
    try {
      const response = await getProfile();        // API call
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
    getUserProfile();
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