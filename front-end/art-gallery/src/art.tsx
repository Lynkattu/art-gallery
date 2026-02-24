import type { JSX } from "react";
import "./art.css";
import { useLocation } from "react-router-dom";
import Topbar from "../components/topbar/topbar";


function Art() {
    const location = useLocation();
    const { art } = location.state || {};

    const artState: JSX.Element = (            
        <div>
            <h4>{art.title}</h4>
            <p>{art.description}</p>
            <img src={art.imageUrl} alt={art.title} />
        </div>
    );

    return <div className="art">
        <Topbar />
        {art && Object.keys(art).length > 0 ? artState : null}
    </div>;
}

export default Art;