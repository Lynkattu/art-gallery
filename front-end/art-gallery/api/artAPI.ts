  import type { ArtsResponse } from '../models/artModel.ts';
  import type {ArtPath} from '../models/artPathModel.ts';
  
  // fetch all art info from the backend API
  async function fetchAllArt(): Promise<void> {
    try {
    const res: Response = await fetch("http://localhost:5000/arts");
    const data: ArtsResponse = await res.json();

    if (!res.ok) {
      throw new Error(data.toString());
    }

    console.log(data);
  } catch (error) {
    console.error("Error fetching arts:", error);
  }
  }

  //fetch random amount of art paths for homepage display (e.g., 10)
  async function fetchRandomArtPaths(count: number): Promise<string[]> {
    try {
      const res: Response = await fetch(`http://localhost:5000/arts/random/${count}`);
      const data = await res.json();
      return data.arts.map((art: ArtPath) => art.imageUrl);
    } catch (error) {
      console.error("Error fetching random art paths:", error);
      return [];
    }
  }


  export { fetchAllArt, fetchRandomArtPaths };