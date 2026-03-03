import { useEffect, useState, type JSX } from "react";
import "./art.css";
import { useLocation } from "react-router-dom";
import Topbar from "../components/topbar/topbar";
import { fetchArtById } from "../api/artAPI";
import type { ArtPath } from "../models/artPathModel";


function Art() {
    const location = useLocation();
    const { art } = location.state || {};
    const [artState, setArtState] = useState<ArtPath | null>(null);

    async function fetchArtFromUrl() {
        const data = await fetchArtById(location.pathname.split("/").pop() || "")
        if (!data) {
            console.error("No art found for the given ID");
            return;
        }
        console.log("Fetched art: ", data);
        setArtState(data);
    }

    useEffect(() => {
        if (art && Object.keys(art).length > 0) {
            console.log("Using art from location state: ", art);
            const data: ArtPath = {
                id: art.id,
                title: art.title,
                description: art.description,
                artist: art.artist,
                createdAt: art.createdAt,
                imageUrl: art.imageUrl
            };
            setArtState(data);
        } else {
            console.log("No art in location state, fetching from URL...");
            fetchArtFromUrl();
        }
    }, [location.state?.art]);

    const artPage: JSX.Element = (
        <div className="art-page">
            <div className="art">
            {/*left*/}
            <div className="content">
                <h4>{artState?.title}</h4>
                <img src={artState?.imageUrl} alt={artState?.title || ""} />
                <p>{artState?.description}</p>

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
        {artState != null ? artPage : <div><p>Loading...</p></div>}
    </div>;
}

export default Art;