import { useState, type JSX } from "react";
import "./showArtDetails.css";

import { MdArrowDropDown } from "react-icons/md";
import { MdArrowDropUp } from "react-icons/md";
import type { ArtPath } from "../../models/artPathModel";
import TagcardCollection from '../tagcardCollection/TagcardCollection';

type Props = {
    art: ArtPath
};

function ShowArtDetails ({ art }: Props) {

    const [showArtDetails, setShowArtDetails] = useState<boolean>(false);

    const artDetails: JSX.Element = (
        <div className="art-details">
            <TagcardCollection tags={art.tags ? art.tags : []} />
            <p>By {art.artist}</p>
            <p>Created: {art.createdAt?.slice(0, 10)}</p>
        </div>
    )
    
    return (
        <div className="show-art-details">
            <button onClick={() => setShowArtDetails(!showArtDetails)}>
                Show {showArtDetails ? "less" : "more"} details {showArtDetails ? <MdArrowDropUp /> : <MdArrowDropDown />}
            </button>
            {showArtDetails ? artDetails : null}
        </div>
    )
}

export default ShowArtDetails;