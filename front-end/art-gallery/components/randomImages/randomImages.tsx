import './randomImages.css';
import { useEffect, useState } from 'react';
import { fetchRandomArtPaths } from '../../api/artAPI.ts';
import type { ArtPath } from '../../models/artPathModel.ts';
import { useNavigate } from "react-router-dom";


type Props = {
    imageCount?: number;
    artPaths?: ArtPath[];
};

function RandomImages({ imageCount, artPaths }: Props) {
    const navigate = useNavigate();

    const [imagePaths, setImagePaths] = useState<ArtPath[]>([]);

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

    return <div className='searched-art'>
        <ul>
            {imagePaths.map((result) => (
                <li className="searched-art-card" key={result.id} onClick={() => {
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