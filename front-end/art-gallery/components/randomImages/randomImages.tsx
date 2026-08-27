import './randomImages.css';
import { useEffect, useState } from 'react';
import { fetchRandomArtPaths } from '../../api/artAPI.ts';
import type { ArtPath } from '../../models/artPathModel.ts';
import { useNavigate } from "react-router-dom";


type Props = {
    imageCount?: number;
    artPaths?: ArtPath[];
    gridTemplateColumns?: string;
};

function RandomImages({ imageCount, artPaths, gridTemplateColumns }: Props) {
    const navigate = useNavigate();

    const [imagePaths, setImagePaths] = useState<ArtPath[]>([]);
    const gridColumns = gridTemplateColumns || "1fr 1fr 1fr 1fr 1fr 1fr";
    const effectiveImageCount = imageCount || 12; // Default to 12 if not provided

    const loadImages = async () => {
        const paths = await fetchRandomArtPaths(effectiveImageCount || 0);
        setImagePaths(paths);
        console.log(paths);
    };
    
    useEffect(() => {
        if (!artPaths || artPaths.length <= 0) {
            loadImages();
        } 
        else if (effectiveImageCount != undefined) {
            setImagePaths(artPaths);
        }


    }, [effectiveImageCount, artPaths]);


    useEffect(() => {
        document.documentElement.style.setProperty('--grid-columns', gridColumns);
    }, [gridColumns]);

    return <div className='searched-art'>
        <ul>
            {imagePaths.slice(0, effectiveImageCount).map((result) => (
                <li className="searched-art-card" key={result.id} onClick={() => {
                    navigate(`/art/${result.id}`);
                }}>
                    <p>{result.title}</p>
                    <img src={result.imageUrl} alt={result.title!} />
                    <p>{`by ${result.artist}`}</p>
                </li>
            ))}
        </ul>
    </div>;
}

export default RandomImages;