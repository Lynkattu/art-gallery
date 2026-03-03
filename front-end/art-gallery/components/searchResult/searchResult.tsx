import './searchResult.css';
import {type ArtPath } from "../../models/artPathModel";
import { useNavigate } from "react-router-dom";


type Props = {
  results: ArtPath[];
}

function SearchResult({ results }: Props) {
    const navigate = useNavigate();

    return <div className='searched-art'>
        <ul>
            {results.map((result, index) => (
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

export default SearchResult;