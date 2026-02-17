  import type { Art, ArtsResponse } from '../models/artModel.ts';
  import type {ArtPath} from '../models/artPathModel.ts';
  
  const serverURL = "http://localhost:5000/";

  // fetch all art info from the backend API
  async function fetchAllArt(): Promise<void> {
    try {
    const res: Response = await fetch(`${serverURL}art`);
    const data: ArtsResponse = await res.json();

    if (!res.ok) {
      throw new Error(data.toString());
    }

    console.log(data);
  } catch (error) {
    console.error("Error fetching arts:", error);
  }
  }

  //fetch arts by search 
  async function fetchArtBySearch(search: string, type: string): Promise<ArtPath[]> {
    console.log(`fetching art by search: ${serverURL}arts/?type=${encodeURIComponent(type)}&search=${encodeURIComponent(search)}`);
    try {
      const res: Response = await fetch(
        `${serverURL}arts/?type=${encodeURIComponent(type)}&search=${encodeURIComponent(search)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.toString());
      }

      return data.arts.map((art: ArtPath) => ({
        id: art.id, 
        title: art.title, 
        description: art.description, 
        imageUrl: art.imageUrl
      }));

    } catch (error) {
      console.error("Error fetching arts by search:", error);
      return [];
    }
  }

  //fetch random amount of art paths for homepage display (e.g., 10)
  async function fetchRandomArtPaths(count: number): Promise<string[]> {
    try {
      const res: Response = await fetch(`${serverURL}arts/random/${count}`);
      const data = await res.json();
      return data.arts.map((art: ArtPath) => art.imageUrl);
    } catch (error) {
      console.error("Error fetching random art paths:", error);
      return [];
    }
  }

  // fetch all arts from user
  async function fetchArtByUser(userId: string): Promise<ArtPath[] | null> {
    try {
      const res: Response = await fetch(`${serverURL}arts/artist/${userId}`);
      const data = await res.json();
      return data.arts.map((art: ArtPath) => ({
        id: art.id, 
        title: art.title, 
        description: art.description, 
        imageUrl: art.imageUrl
      }));

    } catch (error) {
      console.error("Error fetchin art from user:", error);
      return null;
    }
  }

  // post new art
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

      const res: Response = await fetch(`${serverURL}arts`, {
        method: "POST",
        credentials: "include",
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

  // update art
  async function updateArt (art: Art): Promise<PostArtResult> {
    console.log("updating art: ",art.id)
    try {
      const res: Response = await fetch(`${serverURL}arts/${art.id}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: art.title,
          description: art.description
        })
      });
      const data = await res.json();
      
      if (!res.ok) return {success: false, error: `Failed to update art`}

      return {success: true, data}

    } catch (error) {
      console.error("Failed to update art:", art.id)
      return { success: false, error: "Failed to update art" };
    }
  }

  // delete art
  async function deleteArt (id: string): Promise<PostArtResult> {
    try {
      const res: Response = await fetch(`${serverURL}arts/${id}`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
      });      

      if(!res.ok) return {success: false, error: `Failed to delete art: status ${res.status}`}
      const data = await res.json()

      return {success: true, data}

    } catch (error) {
      return {success: false, error: "failed to delete art"}
    }
  }


  export { fetchAllArt, fetchRandomArtPaths, postNewArt, fetchArtByUser, updateArt, deleteArt, fetchArtBySearch };