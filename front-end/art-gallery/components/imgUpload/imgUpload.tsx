import './imgUpload.css';
import { JSX, useEffect, useState } from 'react';
import { IoIosCloseCircle } from "react-icons/io";

function ImgUpload() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drag over');
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
    console.log('File dropped');
  };

  const handleImgInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files!);
  };

  const handleFiles = (files: FileList) => {
    if (!files || files.length <= 0) return;
    const file = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setImgSrc(reader.result as string);
    };
  };

  const uploadContent: JSX.Element = (
    <label className="img-upload" htmlFor="img-upload" onDragOver={handleDragOver} onDrop={handleDrop}>
      <span>Upload Image</span>
      <input type="file" name="img-upload" id="img-upload" onChange={handleImgInput} />
    </label>
  );

  const previewContent: JSX.Element = (
    <div className="img-preview">
      <img src={imgSrc || ''} alt="" />
      <div className="overlay">
        <button className="close-btn" onClick={() => setImgSrc(null)}>
          <div className='close-icon'><IoIosCloseCircle size={30} /></div>
        </button>
      </div> 
    </div>
  );

  return ( 
    imgSrc ? previewContent : uploadContent
  );
}

export default ImgUpload;