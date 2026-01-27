import './myArt.css';
import { useEffect, useState } from 'react';

import type { UserProfile } from '../../models/userProfile';
import {fetchArtByUser} from '../../api/artAPI';
import type { ArtPath } from '../../models/artPathModel';


type props = {
    user: UserProfile | null
}

function MyArt({ user }: props) {
    const [userArts, setUserArts] = useState<ArtPath[] | null>(null)

    useEffect(() => {
        if(user != null) {
            getUserArt();
        }
    }, [])

    async function getUserArt() {
        if (user != null) {
            const arts = await fetchArtByUser(user.id);
            console.log(arts)
            setUserArts(arts)
        }
    }

    return <div className="my-art">
        <div className="my-art-collection">
            <ul>
                {userArts?.map((art, idx) => (
                    <li key={idx}>
                        <p>{art.title}</p>
                        <img src={art.imageUrl} alt={`user image ${idx}`} />
                    </li>
                ))}
            </ul>
        </div>
        <div className="modify-art">
            <form action="">
                <input type="text" placeholder='Title' />
                <textarea placeholder='Description'></textarea>
                <div className='form-buttons'>
                    <button>Submit Change</button>
                    <button>Delete</button>
                </div>
            </form>
        </div>
    </div>
}

export default MyArt;

