import { useContext } from 'react';
import './topbar.css'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/userContext';

function Topbar() {
    const navigate = useNavigate();

    const { user, logoutUser } = useContext(UserContext);
    

    return user !== null ? (
        <div className='topbar'>
            <a className='topbar-logo' href="/"><img src="http://localhost:5000/site_images/ArtGalleryLogo.png" alt="Art Gallery Logo"/></a>
            <button onClick={() => navigate('/profile')}>Profile</button>
            <button onClick={() => logoutUser()}>Logout</button>
            <button onClick={() => navigate('/register')}>Register</button>
        </div>
    ) : (
        <div className='topbar'>
            <a className='topbar-logo' href="/"><img src="http://localhost:5000/site_images/ArtGalleryLogo.png" alt="Art Gallery Logo"/></a>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
        </div>
    );
}

export default Topbar;