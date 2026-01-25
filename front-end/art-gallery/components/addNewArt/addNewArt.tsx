import { useContext, useEffect, useState } from 'react';
import ImgUpload from '../imgUpload/imgUpload';
import './addNewArt.css';

import type { Art } from '../../models/artModel';
import { UserContext } from '../../contexts/userContext.tsx';
import { postNewArt } from '../../api/artAPI.ts';
import { toast, ToastContainer } from 'react-toastify/unstyled';



function AddNewArt() {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState<Art>({
    title: "",
    description: "",
    user_id: user ? user.id : "",
    file: null,
  });

  // handle input changes for all fields
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleArtPath = (artFile: File | null) => {
    setFormData({
      ...formData,
      file: artFile,
    });
  }
  

  // handle form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // prevents page navigation
    const artPost = await postNewArt(formData); // login user using context
    console.log(artPost);
    // if login failed, show error toast
    if (artPost.success == false) {
      
      toast.error(`Art post failed: ${artPost.error}`, {
        position: 'bottom-center',
        autoClose: 3000,
      });
      return;
    }
    toast.success("Art posted successfully!", {
      position: 'bottom-center',
      autoClose: 3000,
    });
  };

  // prevent default browser behavior for drag and drop
  useEffect(() => {
    const prevent = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);

    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, []);

  return <div className='add-new-art-container'>
      <h3>Post New Art</h3>
      <ImgUpload setArtFormFilePath={handleArtPath} />
      <form className='art-details-form'>
          <input onChange={handleChange} type="text" name="title" placeholder='Title' required />
          <textarea onChange={handleChange} name="description" placeholder='Description' required></textarea>
          <button type="submit" onClick={handleSubmit}>Add Art</button>
      </form>
      <ToastContainer />
  </div>;
}

export default AddNewArt;