import './topbar.css'

function Topbar() {
    return <div className='topbar'>
        <a className='topbar-logo' href="/"><img src="http://localhost:5000/site_images/ArtGalleryLogo.png" alt="Art Gallery Logo"/></a>
        <button>Login</button>
        <button>Register</button>
    </div>
}

export default Topbar;