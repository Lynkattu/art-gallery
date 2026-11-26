import './home.css'
import { useEffect, useState } from "react";

import Topbar from "../components/layout/topbar/topbar";
import Radiobutton from "../components/basic/radiobutton/radiobutton";
import SearchBar from "../components/basic/searchBar/searchBar";
import RandomImages from "../components/layout/imageGrid/imageGrid";
import { ToastContainer } from "react-toastify/unstyled";
import { useSearchParams } from 'react-router-dom';
import { fetchArtBySearch, fetchRandomArtPaths } from '../api/artAPI';
import Logo from './assets/ArtGalleryLogo1.png'
import { useQuery } from '@tanstack/react-query';

function Home() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const search = searchParams.get("search");

  const {data: searchResults, isLoading} = useQuery({
    queryKey: ['homePageArt', search, type],
    queryFn: () => {
      if (type && search) {
        return fetchArtBySearch(search, type);
      } else {
        return fetchRandomArtPaths(30);
      }
    },
    enabled: true,
  });
   
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [imageCount] = useState<number>(30); // Number of random arts to fetch and display
  const items = [{title: "Art"}, {title: "Artist"}];


  useEffect(() => {
    if (type) setSelectedValue(type);
    console.log("Search: ", search, " Type: ", type);
  }, [type, search]);

  return (
      <div className="home">
      <Topbar />
      <div className="home-header">
        <img src={Logo} alt="Art Gallery Logo"/>
        <h1>Art Gallery</h1>
      </div>
      <div className='search'>
        <SearchBar type={selectedValue} />
        <Radiobutton
          onSelect={setSelectedValue} 
          items={items} 
            defaultItem={selectedValue ? selectedValue : items[0].title}
          />
        </div>

        {isLoading ? <p>Loading...</p> : null}

        {searchResults && searchResults.length === 0 ? <p>No results found.</p> : null}

        {searchResults && searchResults.length > 0 &&
          <div className="random-arts">
            {search 
            ? <RandomImages artPaths={searchResults} /> 
            : <RandomImages artPaths={searchResults} imageCount={imageCount} />}
          </div>
        }

        <ToastContainer />

      </div>
  )
}

export default Home;