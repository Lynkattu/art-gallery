import { IoMdSearch } from "react-icons/io";


function searchBar() {
  return <div>
    <input type="text" placeholder="Search artworks..." />
    <button type="submit"><IoMdSearch /></button>
  </div>;
}

export default searchBar;