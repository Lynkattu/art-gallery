import './randomImages.css';
import { useEffect, useState } from 'react';
import { fetchRandomArtPaths } from '../../api/artAPI.ts';

type Props = {
    imageCount?: number;
};

function RandomImages({ imageCount }: Props) {

    const [imagePaths, setImagePaths] = useState<string[]>([]);

    useEffect(() => {
        console.log(imageCount);
        const loadImages = async () => {
            const paths = await fetchRandomArtPaths(imageCount || 0);
            setImagePaths(paths);
            console.log(paths);
        };

        loadImages();

    }, []);

    return <div className='random-image'>
        <ul>
            {imagePaths.map((path, index) => (
                <li key={index}>
                    <img src={path} alt={`Random Art ${index}`} />
                </li>
            ))}
        </ul>
    </div>;
}

export default RandomImages;