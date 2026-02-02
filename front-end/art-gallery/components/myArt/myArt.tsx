import './myArt.css';
import { type JSX, useEffect, useState } from 'react';

import type { UserProfile } from '../../models/userProfile';
import {fetchArtByUser, updateArt} from '../../api/artAPI';
import type { ArtPath } from '../../models/artPathModel';
import { useNavigate } from 'react-router-dom';
import type { Art } from '../../models/artModel';
import { toast, ToastContainer } from 'react-toastify';


type props = {
    user: UserProfile | null
}

function MyArt({ user }: props) {
    const navigate = useNavigate();

    const [userArts, setUserArts] = useState<ArtPath[] | null>(null);
    const [selectedArt, setSelectedArt] = useState<ArtPath | null>(null);

    const [formData, setFormData] = useState<Art>({
        id: null,
        title: "",
        description: "",
        user_id: user ? user.id : "",
        file: null,
    });

    const handleSelection = (art: ArtPath) => {
        setFormData({
            id: art.id,
            title: art.title ? art.title : "",
            description: art.description ? art.description : "",
            user_id: user ? user.id : "",
            file: null,
        })
        console.log(formData);
        setSelectedArt(art);
    }

    // handle input changes for all fields
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmitChange = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // prevents page navigation
        if (formData.title == selectedArt?.title && formData.description == selectedArt.description) {
            toast.warning('Changes must be made in order to submit changes.', {
                position: 'bottom-center',
                autoClose: 3000,
            });
        }
        const artUpdate = await updateArt(formData);
        if (artUpdate.success == false) {
            toast.error(`Art post failed: ${artUpdate.error}`, {
            position: 'bottom-center',
            autoClose: 3000,
            });
            return;
        }
        // show success toast
        toast.success("Art Updated successfully!", {
            position: 'bottom-center',
            autoClose: 3000,
        });
        
        getUserArt();
    };

    useEffect(() => {
        if(user != null) {
            getUserArt();
        } 
        else {
            navigate('/login'); // redirect to login if not authenticated
        }
    }, [])

    async function getUserArt() {
        if (user != null) {
            const arts = await fetchArtByUser(user.id);
            console.log(arts)
            setUserArts(arts)
        }
    }

    const artEdit: JSX.Element = (
        <div className="modify-art">
            <form action="">
                <img src={selectedArt?.imageUrl} alt={"Selected image"} />
                <input type="text" name='title' placeholder='Title' value={formData.title} onChange={handleChange} />
                <textarea maxLength={255} name='description' value={formData.description} placeholder='Description' onChange={handleChange}></textarea>
                <div className='form-buttons'>
                    <button onClick={handleSubmitChange}>Submit Change</button>
                    <button>Delete</button>
                </div>
            </form>
        </div>
    );

    const artEmpty: JSX.Element = (
        <div className='modify-art'></div>
    );

    return <div className="my-art">
        <div className="my-art-collection">
            <ul>
                {userArts?.map((art, idx) => (
                    <li key={idx} onClick={() => handleSelection(art)}>
                        <p>{art.title}</p>
                        <img src={art.imageUrl} alt={`user image ${idx}`} />
                    </li>
                ))}
            </ul>
        </div>
        {selectedArt ? artEdit : artEmpty}
        <ToastContainer />
    </div>
}

export default MyArt;

