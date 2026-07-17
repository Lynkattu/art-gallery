import { useEffect, useState, type JSX } from "react";
import "./art.css";
import { useLocation } from "react-router-dom";
import Topbar from "../components/topbar/topbar";
import { fetchArtById, fetchRandomArtsFromUser, fetchSimilarArts, type PostArtResult } from "../api/artAPI";
import type { ArtPath } from "../models/artPathModel";
import ShowArtDetails from "../components/showArtDetails/showArtDetails";
import ArtComments from "../components/ArtComments/ArtComments";
import RandomImages from "../components/randomImages/randomImages";



function Art() {
    const location = useLocation();
    const { art } = location.state || {};
    const [artState, setArtState] = useState<ArtPath | null>(null);
    const [similarArts, setSimilarArts] = useState<ArtPath[]>([]);
    const [randomArtsFromUser, setRandomArtsFromUser] = useState<ArtPath[]>([]);

    // Fetch art from URL if not in location state
    async function fetchArtFromUrl() {
        const data = await fetchArtById(location.pathname.split("/").pop() || "")
        if (!data) {
            console.error("No art found for the given ID");
            return;
        }
        console.log("Fetched art: ", data);
        setArtState(data);
    }

    // Fetch similar arts
    async function getSimilarArts(artId: string) {
        const data: PostArtResult<ArtPath[]> = await fetchSimilarArts(artId);
        if (data.success) {
            setSimilarArts(data.data);
        }
    }

    // Fetch random arts from the same artist
    async function getRandomArtsFromUser(username: string, count: number) {
        const data: PostArtResult<ArtPath[]> = await fetchRandomArtsFromUser(username, count);
        if (data.success) {
            // Handle the random arts from user data as needed
            setRandomArtsFromUser(data.data);
        }
    }

    // main art useEffect, check if art is in location state, if not fetch from URL
    useEffect(() => {
        if (art && Object.keys(art).length > 0) {
            console.log("Using art from location state: ", art);
            const data: ArtPath = {
                id: art.id,
                title: art.title,
                description: art.description,
                artist: art.artist,
                createdAt: art.createdAt,
                imageUrl: art.imageUrl,
                tags: art.tags,
            };
            setArtState(data);
        } else {
            console.log("No art in location state, fetching from URL...");
            fetchArtFromUrl();
        }
    }, [location.state?.art]);

    // Fetch similar arts
    useEffect(() => {
        if (artState && artState.id) {
            getSimilarArts(artState.id)
        }
    }, [artState]);

    // Fetch random arts from the same artist
    useEffect(() => {
        if (artState && artState.artist) {
            getRandomArtsFromUser(artState.artist, 10);
        }
    }, [artState]);

    const artPage: JSX.Element = (
        <div className="art-page">
            <div className="art">
            {/*left*/}
            <div className="content">
                <h4>{artState?.title}</h4>
                <img src={artState?.imageUrl} alt={artState?.title || ""} />
                <ShowArtDetails art={artState ? artState : art} />
                <p>{artState?.description}</p>

            </div>
            {/*right divided horizantally to half*/}
            <div className="recommendations" >
                <div className="recommended-art">
                    <h5>Recommended Art</h5>
                    {similarArts.length > 0 ? (
                        <RandomImages artPaths={similarArts} imageCount={10} />
                    ) : (
                        <p>No similar arts found.</p>
                    )}
                </div>
                <div className="artist-art">
                    <h5>More from this Artist</h5>

                    {randomArtsFromUser.length > 0 ? (
                        <RandomImages artPaths={randomArtsFromUser} imageCount={10} />
                    ) : (
                        <p>No arts from this artist found.</p>
                    )}
                </div>
            </div>
            </div>
            
            {/*bottom*/}
            <ArtComments artId={artState?.id || ""} />

        </div>
    );

    return <div >
        <Topbar />
        {artState != null ? artPage : <div><p>Loading...</p></div>}
    </div>;
}

export default Art;