import './imgUpload.css';
import { type JSX, useEffect, useState } from 'react';

type Props = {
    setArtFormFilePath: ( path: File | null) => void;
    setReset: React.Dispatch<React.SetStateAction<boolean>>;
    reset: boolean;
};

function ImgUpload({ setArtFormFilePath, setReset, reset }: Props) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    if (reset) {
      setImgSrc(null);
      setArtFormFilePath(null);
      setReset(false);
    }
  }, [reset]);

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
    setArtFormFilePath(file);

  };

  const uploadContent: JSX.Element = (
    <label className="img-upload" htmlFor="img-upload" onDragOver={handleDragOver} onDrop={handleDrop}>
      <span>Upload Image</span>
      <input type="file" name="img-upload" id="img-upload" onChange={handleImgInput} />
    </label>
  );

  const previewContent: JSX.Element = (
    <div className="img-preview">
      <img onClick={() => setImgSrc(null)} src={imgSrc || ''} alt="" />
    </div>
  );

  return ( 
    imgSrc ? previewContent : uploadContent
  );
}

export default ImgUpload;