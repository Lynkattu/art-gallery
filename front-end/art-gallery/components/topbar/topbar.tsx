import './topbar.css'
import { useNavigate } from 'react-router-dom';

function Topbar() {
    const navigate = useNavigate();

    return <div className='topbar'>
        <a className='topbar-logo' href="/"><img src="http://localhost:5000/site_images/ArtGalleryLogo.png" alt="Art Gallery Logo"/></a>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/register')}>Register</button>
    </div>
}

export default Topbar;