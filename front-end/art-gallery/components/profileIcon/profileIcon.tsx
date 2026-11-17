import { useContext, useEffect, useRef, useState } from 'react';
import './profileIcon.css';
import { changeUserIcon } from '../../api/userAPI';
import { UserContext } from '../../contexts/userContext';

interface props {
    allowIconChange?: boolean;
    onClick?: () => void;
    diameter?: number;
}

function ProfileIcon({ allowIconChange = false, onClick, diameter = 96 }: props) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { user } = useContext(UserContext);
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string | null>(null);

    const handleFileUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        fileUploadRef.current?.click();
        console.log("File upload button clicked");
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && user) {
            const response = await changeUserIcon(user.id, file);

            if (response.status === 201) {
                console.log("User icon saved successfully");
                //setImage(URL.createObjectURL(file));
                //user.userIcon = response.data;
                //setImage(`${apiUrl}/user-icons/${user.userIcon}?v=${new Date().getTime()}`);

            } else {
                console.error("Failed to save user icon");
            }
        }
    };

    useEffect(() => {
        if(user?.userIcon) {
            setImage(`${apiUrl}/user-icons/${user.userIcon}?v=${new Date().getTime()}`);
        }

    }, []);

    return (
        <div className="profile-icon">
            <form>
                {(image) ?
                    <img src={image} style={{ width: `${diameter}px`, height: `${diameter}px` }} alt="Profile Icon" />
                    :
                    <></>
                }
                <input ref={fileUploadRef} type="file" accept="image/*" hidden onChange={handleChange} />
                {allowIconChange ? (
                    <button style={{ width: `${diameter}px`, height: `${diameter}px` }} onClick={handleFileUpload}></button>
                ) : onClick ? (
                    <button type="button" style={{ width: `${diameter}px`, height: `${diameter}px` }} onClick={onClick}></button>
                ) : <button style={{ width: `${diameter}px`, height: `${diameter}px` }} disabled></button>}
            </form>
        </div>
    )
}

export default ProfileIcon;