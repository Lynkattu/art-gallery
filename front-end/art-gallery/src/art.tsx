import type { JSX } from "react";
import "./art.css";
import { useLocation } from "react-router-dom";
import Topbar from "../components/topbar/topbar";


function Art() {
    const location = useLocation();
    const { art } = location.state || {};

    const artPage: JSX.Element = (
        <div className="art-page">
            <div className="art">
            {/*left*/}
            <div className="content">
                <h4>{art.title}</h4>
                <img src={art.imageUrl} alt={art.title} />
                <p>{art.description}</p>

            </div>
            {/*right divided horizantally to half*/}
            <div className="recommendations" >
                <div className="recommended-art">
                    <h5>Recommended Art</h5>
                </div>
                <div className="artist-art">
                    <h5>More from this Artist</h5>
                </div>
            </div>
            </div>
            
            {/*bottom*/}
            <div className="comments">
                <h5>Comments</h5>
            </div>

        </div>          

    );

    return <div >
        <Topbar />
        {art && Object.keys(art).length > 0 ? artPage : null}
    </div>;
}

export default Art;