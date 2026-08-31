import './downloadBt.css'
import { downloadImage } from '../../api/artAPI'

interface DownloadBtProps {
    filename: string
}

function DownloadBt({ filename }: DownloadBtProps) {

    const downloadArt = async () => {
        const result = await downloadImage(filename);

        if (!result.success) {
            console.error("Error downloading art:", result.error);
        }
    }

    return(
        <button className="download-bt" onClick={downloadArt}>
            Download
        </button>
    )
}

export default DownloadBt