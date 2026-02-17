import { useState } from "react";
import "./searchBar.css";
import { IoMdSearch } from "react-icons/io";
import type { ArtPath } from "../../models/artPathModel";
import { fetchArtBySearch } from "../../api/artAPI";
import { useNavigate } from "react-router";


type Props = {
  setSearchResults?: React.Dispatch<React.SetStateAction<ArtPath[]>>;
  type: string | null;
}

function searchBar(props: Props) {
  const navigate = useNavigate();
  const [searchTxt, setSearchTxt] = useState<string>("");

  const handleSearch = async () => {
    console.log("Searching for: ", searchTxt);
    navigate(`/arts?type=${encodeURIComponent(props.type ? props.type : "")}&search=${encodeURIComponent(searchTxt)}`);
  }

  return <div className="search-bar">
    <input type="text" placeholder="Search artworks..." value={searchTxt} onChange={(e) => setSearchTxt(e.target.value)} />
    <button type="submit" onClick={handleSearch}><IoMdSearch size={24}/></button>
  </div>;
}

export default searchBar;