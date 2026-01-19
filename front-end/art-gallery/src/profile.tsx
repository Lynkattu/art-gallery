import { useContext, useEffect, useState } from 'react';
import type { UserProfile } from '../models/userProfile.ts';
import Topbar from '../components/topbar/topbar.tsx';
import { UserContext } from '../contexts/userContext.tsx';
import { useNavigate } from 'react-router-dom';

function Profile() {
  // get user from user context
  const { user } = useContext(UserContext);
  //data used to display profile info
  const [data, setData] = useState<UserProfile | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    
    if (user == null) {
      navigate('/login'); // redirect to login if not authenticated
    }
    setData(user);
    
  }, [user]);
  
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

export default Profile;