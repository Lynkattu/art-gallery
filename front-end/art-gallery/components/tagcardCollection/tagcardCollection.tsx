import "./tagcardCollection.css";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Art } from "../../models/artModel";

type Props = {
    tags: string[];
    setFormData: React.Dispatch<React.SetStateAction<Art>>;
}

function TagcardCollection({ tags, setFormData }: Props) {

    function handleTags(index: number, setFormData: React.Dispatch<React.SetStateAction<Art>>) {
        setFormData(prevData => ({
            ...prevData,
            tags: prevData.tags.filter((_, i) => i !== index)
        }))
    }
    
    return (
        <div className="tagcard-collection">
            {tags.map((tag, index) => (
                <div className="tagcard" key={index}>
                    <p>{tag}</p>
                    <IconButton onClick={() => handleTags(index, setFormData)} aria-label="delete" size="small">
                        <CloseIcon className="close-icon" fontSize="small"/>
                    </IconButton>
                </div>
            ))}
        </div>
    );
}

export default TagcardCollection;