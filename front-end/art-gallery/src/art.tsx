import { useEffect, useState, type JSX } from "react";
import "./art.css";
import { useLocation, useParams } from "react-router-dom";
import Topbar from "../components/topbar/topbar";
import { fetchArtById, fetchRandomArtsFromUser, fetchSimilarArts, type PostArtResult } from "../api/artAPI";
import type { ArtPath } from "../models/artPathModel";
import ShowArtDetails from "../components/showArtDetails/showArtDetails";
import ArtComments from "../components/ArtComments/ArtComments";
import RandomImages from "../components/randomImages/randomImages";
import moment from "moment";



function Art() {
    const location = useLocation();
    const { id } = useParams();

    const [artState, setArtState] = useState<ArtPath>({id: null,
                title: null,
                description: null,
                artist: null,
                createdAt: null,
                imageUrl: undefined,
                tags: null,});
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
    async function getRandomArtsFromUser(username: string, current_art: String | null, count: number) {
        const data: PostArtResult<ArtPath[]> = await fetchRandomArtsFromUser(username, current_art, count);
        if (data.success) {
            // Handle the random arts from user data as needed
            setRandomArtsFromUser(data.data);
        }
    }

    // main art useEffect, check if art is in location state, if not fetch from URL
    useEffect(() => {

        if (!id) return;

        fetchArtFromUrl();

    }, [id]/* [location.state?.art] */);

    // Fetch similar arts
    useEffect(() => {
        if (artState && artState.id) {
            getSimilarArts(artState.id)
        }
    }, [artState.id]);

    // Fetch random arts from the same artist
    useEffect(() => {
        if (artState && artState.artist) {
            getRandomArtsFromUser(artState.artist, artState.id, 10);
        }
    }, [artState.id]);

    const artPage: JSX.Element = (
        <div className="art-page">
            <div className="art">
            {/*left*/}
            <div className="content">
                <h4>{artState?.title}</h4>
                <img src={artState?.imageUrl} alt={artState?.title || ""} />
                <div className="info">
                    <div>
                        <p>by {artState?.artist}</p>
                        <p>Published: {moment(artState?.createdAt).format("DD-MM-YYYY")}</p>
                    </div>

                    {/* <ShowArtDetails art={artState ? artState : art} /> */}
                    <p>{artState?.description}</p>
                </div>


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
            {artState?.id ? (
                <ArtComments artId={artState.id} />
            ) : (
                <p>No art selected</p>
            )}

        </div>
    );

    return <div >
        <Topbar />
        {artState != null ? artPage : <div><p>Loading...</p></div>}
    </div>;
}

export default Art;