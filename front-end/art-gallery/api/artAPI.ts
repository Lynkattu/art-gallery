  import type { Art, ArtsResponse } from '../models/artModel.ts';
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

  type PostArtResult =
  | { success: true; data: any }
  | { success: false; error: string };

  async function postNewArt(art: Art): Promise<PostArtResult> {
    try {
      console.log("Posting new art:", art);
      if (!art.title || !art.description || !art.user_id || !art.file) {
        return { success: false, error: "All fields are required" };
      }

      const formData = new FormData();
      formData.append("title", art.title);
      formData.append("description", art.description);
      formData.append("user_id", art.user_id);
      formData.append("uploaded_file", art.file);

      const res: Response = await fetch("http://localhost:5000/arts", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.toString() };
      }

      console.log("Art posted successfully:", data);
      return { success: true, data };

    } catch (error) {
      console.error("Error posting new art:", error);
      return { success: false, error: "Failed to post new art" };
    }

  }


  export { fetchAllArt, fetchRandomArtPaths, postNewArt };