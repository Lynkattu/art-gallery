import { useState } from 'react';
import './viewCollection.css';


function ViewCollection() {

    const [collections, setCollections] = useState([]);

    return <div className='view-collection'>
        <h3>Collections</h3>
        <button>new collection</button>
    
    </div>;
}

export default ViewCollection;