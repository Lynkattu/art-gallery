import { useEffect } from 'react';
import ImgUpload from '../imgUpload/imgUpload';
import './addNewArt.css';

function AddNewArt() {

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
        <ImgUpload />
    </div>;
}

export default AddNewArt;