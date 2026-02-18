import './searchResult.css';
import {type ArtPath } from "../../models/artPathModel";

type Props = {
  results: ArtPath[];
}

function SearchResult({ results }: Props) {
 return <div className='searched-art'>
        <ul>
            {results.map((result, index) => (
                <li key={index}>
                    <p>{result.title}</p>
                    <img src={result.imageUrl} alt={result.title!} />
                    <p>{`by ${result.artist}`}</p>
                </li>
            ))}
        </ul>
    </div>;
}

export default SearchResult;