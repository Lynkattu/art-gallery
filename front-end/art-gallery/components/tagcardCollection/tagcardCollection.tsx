import "./tagcardCollection.css";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {type Art } from "../../models/artModel";
import { useState } from "react";

type Props = {
    tags: string[];
    setFormData?: React.Dispatch<React.SetStateAction<Art>> | null;
}

function TagcardCollection({ tags, setFormData = null }: Props) {

    function handleTags(index: number, setFormData: React.Dispatch<React.SetStateAction<Art>>) {
        setFormData(prevData => ({
            ...prevData,
            tags: prevData.tags.filter((_, i) => i !== index)
        }))
    }
    
    return (
        <div className="tagcard-collection">
            {tags.map((tag, index) => (
                <div className={"tagcard"} key={index}>
                    <p>{tag}</p>
                    {
                        setFormData ?
                    <IconButton 
                        onClick={() =>  handleTags(index, setFormData)} 
                        aria-label="delete" size="small">
                        <CloseIcon className="close-icon" fontSize="small"/>
                    </IconButton>
                    : null
}
                </div>
            ))}
        </div>
    );
}

export default TagcardCollection;