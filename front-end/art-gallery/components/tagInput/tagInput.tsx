import "./tagInput.css";
import { useState } from "react";
import { Art } from "../../models/artModel";

type Props = {
    setFormData: React.Dispatch<React.SetStateAction<Art>>;
    formData: Art;
}

function TagInput({ setFormData, formData}: Props) {

    const [tags, setTags] = useState<string>("");


    const handleTagsSubmit = () => {
    setTags("");
    const newTags = tags.split(",").map(str =>
    str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "") // keep only letters and numbers
    );
    const tagsData = [...new Set([...formData.tags, ...newTags])];

    setFormData({...formData, tags: tagsData})
  }

    return ( 
        <div className='tags-input'>
            <input onChange={(e) => setTags(e.target.value)} maxLength={64} value={tags} type="text" name="tags" placeholder='Tags (comma-separated)' />
            <button type="button" onClick={handleTagsSubmit}>Add Tags</button>
        </div>
    )
}

export default TagInput;