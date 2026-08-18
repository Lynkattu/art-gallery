import { useEffect, useState, type JSX } from "react";
import "./art.css";
import { useParams } from "react-router-dom";
import Topbar from "../components/topbar/topbar";
import { fetchArtById, fetchRandomArtsFromUser, fetchSimilarArts, type PostArtResult } from "../api/artAPI";
import type { ArtPath } from "../models/artPathModel";
import ShowArtDetails from "../components/showArtDetails/showArtDetails";
import ArtComments from "../components/ArtComments/ArtComments";
import RandomImages from "../components/randomImages/randomImages";
import moment from "moment";
import LineBreak from "../components/lineBreak/lineBreak";



function Art() {
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

    const imageCount = 12; // Number of random arts to fetch and display

    // Fetch art from URL
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
        const data: PostArtResult<ArtPath[]> = await fetchSimilarArts(artId, imageCount);
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
            getRandomArtsFromUser(artState.artist, artState.id, imageCount);
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

                <LineBreak />

                {artState?.id && (
                    <ArtComments artId={artState.id} />
                )}

            </div>
            {/*right divided horizantally to half*/}
            <div className="recommendations" >
                <div className="recommended-art">
                    <h5>Recommended</h5>
                    {similarArts.length > 0 ? (
                        <RandomImages artPaths={similarArts} imageCount={imageCount} gridTemplateColumns="1fr 1fr 1fr 1fr" />
                    ) : (
                        <p>No similar arts found.</p>
                    )}
                </div>
                <div className="artist-art">
                    <h5>More from {artState?.artist}</h5>

                    {randomArtsFromUser.length > 0 ? (
                        <RandomImages artPaths={randomArtsFromUser} imageCount={imageCount} gridTemplateColumns="1fr 1fr 1fr 1fr" />
                    ) : (
                        <p>No arts from this artist found.</p>
                    )}
                </div>
            </div>
            </div>
            


        </div>
    );

    return <div >
        <Topbar />
        {artState != null ? artPage : <div><p>Loading...</p></div>}
    </div>;
}

export default Art;