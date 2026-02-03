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

  return (
      <div className="home">
      <Topbar />
        <h1>Art Gallery</h1>
        <Radiobutton
          onSelect={setSelectedValue} 
          items={[{title: "Art"}, {title: "Artist"}, {title: "Category"}]} 
        />
        <SearchBar/>
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