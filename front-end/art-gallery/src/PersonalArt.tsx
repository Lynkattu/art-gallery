import './PersonalArt.css';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../contexts/userContext.tsx';
import { useNavigate } from 'react-router';

import Topbar from '../components/layout/topbar/topbar.tsx';
import PersonalArtSideNav from '../components/layout/personalArtSideNav/personalArtSideNav.tsx';
import AddNewArt from '../components/layout/addNewArt/addNewArt.tsx';
import ViewCollection from '../components/layout/viewCollection/viewCollection.tsx';
import MyArt from '../components/layout/myArt/myArt.tsx'

function PersonalArt() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [ selected, setSelected] = useState<string>('view-collection');

    useEffect(() => {
    
    if (user == null) {
        navigate('/login'); // redirect to login if not authenticated
    }
    
    }, [user]);

  return (
    <div className="personal-art-page">
      <Topbar/>
      <div className="personal-art-page-sidebar">
        <PersonalArtSideNav setSelected={setSelected} />
      </div>
      <div className="personal-art-page-content">
        {selected == 'view-collection' ? <ViewCollection /> : ""}
        {selected == 'add-new-art' ? <AddNewArt /> : ""}
        {selected == 'my-art' ? <MyArt user={user}/> : ""}
      </div>

    </div>
  );
}

export default PersonalArt;