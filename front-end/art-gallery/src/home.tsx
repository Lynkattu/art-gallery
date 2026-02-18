import './home.css'
import { useEffect, useState } from "react";

import Topbar from "../components/topbar/topbar";
import Radiobutton from "../components/radiobutton/radiobutton";
import SearchBar from "../components/searchBar/searchBar";
import RandomImages from "../components/randomImages/randomImages";
import { ToastContainer } from "react-toastify/unstyled";
import type { ArtPath } from '../models/artPathModel';
import { useSearchParams } from 'react-router-dom';
import { fetchArtBySearch } from '../api/artAPI';
import SearchResult from '../components/searchResult/searchResult';

function Home() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const search = searchParams.get("search");
   
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [imageCount] = useState<number>(20);
  const [searchResults, setSearchResults] = useState<ArtPath[]>([]);
  const items = [{title: "Art"}, {title: "Artist"}];

  const fetchArt = async (type: string, search: string) => {
    const fetchedArt = await fetchArtBySearch(search, type);
    if (fetchedArt.length > 0) {
      console.log("Search results: ", fetchedArt);
      setSearchResults(fetchedArt);
    }
  };

  useEffect(() => {
    if (type && search) {
      setSelectedValue(type);
      fetchArt(type, search);
    }
  }, [type, search]);

  return (
      <div className="home">
      <Topbar />
        <h1>Art Gallery</h1>
        <div className='search'>
          <SearchBar type={selectedValue} setSearchResults={setSearchResults} />
          <Radiobutton
            onSelect={setSelectedValue} 
            items={items} 
            defaultItem={selectedValue ? selectedValue : items[0].title}
          />
        </div>
        <div className="random-arts">
          {searchResults.length > 0 && search?.length !== 0 
          ? <SearchResult results={searchResults} /> 
          : <RandomImages imageCount={imageCount} />}
        </div>
        <ToastContainer />

      </div>
  )
}

export default Home;