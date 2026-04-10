import './randomImages.css';
import { useEffect, useState } from 'react';
import { fetchRandomArtPaths } from '../../api/artAPI.ts';
import type { ArtPath } from '../../models/artPathModel.ts';
import { useNavigate } from "react-router-dom";


type Props = {
    imageCount?: number;
};

function RandomImages({ imageCount }: Props) {
    const navigate = useNavigate();

    const [imagePaths, setImagePaths] = useState<ArtPath[]>([]);

    useEffect(() => {
        console.log(imageCount);
        const loadImages = async () => {
            const paths = await fetchRandomArtPaths(imageCount || 0);
            setImagePaths(paths);
            console.log(paths);
        };

        loadImages();

    }, []);

    return <div className='random-images'>
        <ul>
            {imagePaths.map((result, index) => (
                <li key={index} onClick={() => {
                    navigate(`/art/${result.id}`, { state: { art: result } });
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