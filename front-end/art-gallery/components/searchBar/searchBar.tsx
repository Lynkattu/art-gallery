import { useState } from "react";
import "./searchBar.css";
import { IoMdSearch } from "react-icons/io";


function searchBar() {

  const [searchTxt, setSearchTxt] = useState<string>("");

  const handleSearch = () => {
    console.log("Searching for: ", searchTxt);
  }

  return <div className="search-bar">
    <input type="text" placeholder="Search artworks..." value={searchTxt} onChange={(e) => setSearchTxt(e.target.value)} />
    <button type="submit" onClick={handleSearch}><IoMdSearch size={24}/></button>
  </div>;
}

export default searchBar;