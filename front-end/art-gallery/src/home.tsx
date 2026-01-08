import { useState } from "react";

import Topbar from "../components/topbar/topbar";
import Radiobutton from "../components/radiobutton/radiobutton";
import SearchBar from "../components/searchBar/searchBar";
import RandomImages from "../components/randomImages/randomImages";

function Home() {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [imageCount] = useState<number>(2);

  return (
      <div>
      <Topbar />
        <h1>Art Gallery</h1>
        <Radiobutton
          onSelect={setSelectedValue} 
          items={[{title: "Art"}, {title: "Artist"}, {title: "Category"}]} 
        />
        <SearchBar/>
        <RandomImages 
          imageCount={imageCount}
        />
      </div>
  )
}

export default Home;