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
    const [gridColumns, setGridColumns] = useState<string>(gridTemplateColumns || "1fr 1fr 1fr 1fr 1fr 1fr");

    useEffect(() => {
        if (!artPaths || artPaths.length <= 0) {
        const loadImages = async () => {
            const paths = await fetchRandomArtPaths(imageCount || 0);
            setImagePaths(paths);
            console.log(paths);
        };

        loadImages();
    } else {
        setImagePaths(artPaths);
    }

    }, [imageCount, artPaths]);

    // Update grid columns if gridTemplateColumns prop changes
    useEffect(() => {
        if (gridTemplateColumns) {
            setGridColumns(gridTemplateColumns);
        }
    }, [gridTemplateColumns]);
    
    // Update CSS variable for grid columns whenever gridColumns state changes
    useEffect(() => {
        document.documentElement.style.setProperty('--grid-columns', gridColumns);
    }, [gridColumns]);

    return <div className='searched-art'>
        <ul>
            {imagePaths.map((result) => (
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