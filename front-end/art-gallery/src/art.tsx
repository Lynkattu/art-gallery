import { useEffect, useState, type JSX } from "react";
import "./art.css";
import { useParams } from "react-router-dom";
import Topbar from "../components/topbar/topbar";
import { fetchArtById, fetchRandomArtsFromUser, fetchSimilarArts, type PostArtResult } from "../api/artAPI";
import type { ArtPath } from "../models/artPathModel";
import ArtComments from "../components/ArtComments/ArtComments";
import RandomImages from "../components/randomImages/randomImages";
import moment from "moment";
import LineBreak from "../components/lineBreak/lineBreak";
import TagcardCollection from "../components/tagcardCollection/TagcardCollection";


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
    const [imageCount, setImageCount] = useState<number>(12); // Number of random arts to fetch and display
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
    });
    let isWideScreen = window.matchMedia("(width >= 900px)");
    const [gridTemplateColumns, setGridTemplateColumns] = useState(isWideScreen.matches ? "1fr 1fr 1fr 1fr" : "1fr 1fr");

    // Handle window resize
    function handleResize() {
        setDimensions({
            width: window.innerWidth,
        });
    }

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

    // Add event listener for window resize
    useEffect(() => {
        window.addEventListener("resize", handleResize, false);
    }, []);

    // Update UI When screen width changes
    useEffect(() => {
        if (window.matchMedia("(width < 900px)").matches) {
            setImageCount(6);
            setGridTemplateColumns("1fr 1fr");
        } else if (window.matchMedia("(width < 1400px)").matches) {
            setImageCount(9);
            setGridTemplateColumns("1fr 1fr 1fr");
        } else {
            setImageCount(12);
            setGridTemplateColumns("1fr 1fr 1fr 1fr");
        }
        console.log("Screen width changed, new image count: ", gridTemplateColumns, imageCount);
    }, [dimensions.width]);

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
                    <p>{artState?.description}</p>
                </div>

                <TagcardCollection tags={artState?.tags || []} />

                {isWideScreen.matches ? (<LineBreak />) : null}
                {artState?.id && (
                    isWideScreen.matches ? (
                        <ArtComments artId={artState.id} />
                    ) : (null)
                )}

            </div>
            {/*right divided horizantally to half*/}
            <div className="recommendations" >
                <div className="recommended-art">
                    <h5>Recommended</h5>
                    {similarArts.length > 0 ? (
                        <RandomImages artPaths={similarArts} imageCount={imageCount} gridTemplateColumns={gridTemplateColumns} />
                    ) : (
                        <p>No similar arts found.</p>
                    )}
                </div>
                <div className="artist-art">
                    <h5>More from {artState?.artist}</h5>

                    {randomArtsFromUser.length > 0 ? (
                        <RandomImages artPaths={randomArtsFromUser} imageCount={imageCount} gridTemplateColumns={gridTemplateColumns} />
                    ) : (
                        <p>No arts from this artist found.</p>
                    )}
                </div>

                {/* Show comments at the bottom if the screen is narrow */}
                {!isWideScreen.matches ? (<LineBreak />) : null}
                {artState?.id && (
                    !isWideScreen.matches ? (
                        <ArtComments artId={artState.id} />
                    ) : (null)
                )}            
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