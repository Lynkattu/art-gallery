import './home.css'
import { useState } from "react";

import Topbar from "../components/topbar/topbar";
import Radiobutton from "../components/radiobutton/radiobutton";
import SearchBar from "../components/searchBar/searchBar";
import RandomImages from "../components/randomImages/randomImages";
import { ToastContainer } from "react-toastify/unstyled";

function Home() {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [imageCount] = useState<number>(10);
  const items = [{title: "Art"}, {title: "Artist"}, {title: "Category"}];

  return (
      <div className="home">
      <Topbar />
        <h1>Art Gallery</h1>
        <div className='search'>
          <SearchBar/>
          <Radiobutton
            onSelect={setSelectedValue} 
            items={items} 
            defaultItem={items[0].title}
          />
        </div>
        <div className="random-arts">
          <RandomImages 
            imageCount={imageCount}
          />
        </div>
        <ToastContainer />

      </div>
  )
}

export default Home;