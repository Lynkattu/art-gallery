  import type { ArtComment } from '../models/artCommentModel.ts';
import type { Art, ArtsResponse } from '../models/artModel.ts';
  import type { ArtPath } from '../models/artPathModel.ts';
  
  const serverURL = "http://localhost:5000/";
  const mlServerURL = "http://localhost:8000/";

  type PostArtResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

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
        artist: art.artist,
        createdAt: art.createdAt,
        imageUrl: art.imageUrl,
        tags: art.tags ? art.tags : []
      }));

    } catch (error) {
      console.error("Error fetching arts by search:", error);
      return [];
    }
  }

  //fetch art by id
  async function fetchArtById(id: string): Promise<ArtPath | null> {
    try {
      const res: Response = await fetch(`${serverURL}arts/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.toString());
      }

      const artData: ArtPath = {
        id: data.art.id, 
        title: data.art.title, 
        description: data.art.description, 
        artist: data.art.artist,
        createdAt: data.art.createdAt,
        imageUrl: data.art.imageUrl,
        tags: data.art.tags ? data.art.tags : []
      };

      return artData;

    } catch (error) {
      console.error("Error fetching art by id:", error);
      return null;
    }
  }

  //fetch random amount of art paths for homepage display (e.g., 10)
  async function fetchRandomArtPaths(count: number): Promise<ArtPath[]> {
    try {
      const res: Response = await fetch(`${serverURL}arts/random/${count}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.toString());
      }
      return data.arts.map((art: ArtPath) => ({
        id: art.id, 
        title: art.title, 
        description: art.description, 
        imageUrl: art.imageUrl,
        tags: art.tags,
        createdAt: art.createdAt,
        artist: art.artist
      }));
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
        imageUrl: art.imageUrl,
        tags: art.tags
      }));

    } catch (error) {
      console.error("Error fetchin art from user:", error);
      return null;
    }
  }

  // post new art
  async function postNewArt(art: Art): Promise<PostArtResult<any>> {
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
      formData.append("tags", JSON.stringify(art.tags));

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
  async function updateArt (art: Art): Promise<PostArtResult<any>> {
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
          description: art.description,
          tags: art.tags
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
  async function deleteArt (id: string): Promise<PostArtResult<any>> {
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

  // post a new comment for an art
  async function postComment(artId: string, userId: string, comment: string ) {
    console.log(`Posting comment for art ${artId} by user ${userId}: ${comment}`);
    try {

      const res: Response = await fetch(`${serverURL}arts/${artId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          comment: comment,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: JSON.stringify(data) };
      }

      return { success: true, data };
    
    } catch (error) {
      console.error("Error posting comment:", error);
      return {success: false, error: "Posting comment failed"}
    }
  }

  //fetch comments for an art
  async function fetchArtComments(artId: string) : Promise<ArtComment[]> {
    try {
      const res: Response = await fetch(`${serverURL}arts/${artId}/comments`, {
        method: "GET",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.toString());
      }

      return data.comments.map((comment: ArtComment) => ({
        username: comment.username,
        comment: comment.comment,
        createdAt: new Date(comment.createdAt)
      }));
    
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  }
  
  // fetch similar arts from ML server
  async function fetchSimilarArts(artId: string) : Promise<PostArtResult<ArtPath[]>> {
    try {
      const res: Response = await fetch(`${mlServerURL}recommendations/${artId}`, {
        method: "GET",
      });
      const data = await res.json();
            console.log("Fetched similar arts: ", data);


      if (!res.ok) {
        return {success: false, error: JSON.stringify(data)};
      }
      const arts: ArtPath[] = data.map((art: any) => ({
        id: art.id ? art.id : null,
        title: art.title ? art.title : null,
        description: art.description ? art.description : null,
        imageUrl: `${serverURL}images/${art.imageUrl}`,
        tags: art.tags ? art.tags : [],
        createdAt: art.createdAt ? art.createdAt : null,
        artist: art.artist ? art.artist : null
      }));

      return {success: true, data: arts};
    } catch (error) {
      return {success: false, error: "Failed to fetch similar arts"}
    }
  }

  async function fetchRandomArtsFromUser(username: string, count: number): Promise<PostArtResult<ArtPath[]>> {
    try {
      const res: Response = await fetch(`${serverURL}arts/random/user/${username}/${count}`);
      const data = await res.json();

      if (!res.ok) {
        return {success: false, error: JSON.stringify(data)};
      }

      const arts: ArtPath[] = data.arts.map((art: any) => ({
        id: art.id,
        title: art.title,
        description: art.description,
        imageUrl: `${serverURL}images/${art.filePath}`,
        tags: art.tags,
        createdAt: art.createdAt,
        artist: art.username
      }));

      console.log("random arts from user: ", arts);


      return {success: true, data: arts};
    } catch (error) {
      console.error("Error fetching random arts from user:", error);
      return {success: false, error: "Failed to fetch random arts from user"};
    }
  }


export {
  fetchAllArt, fetchRandomArtPaths, postNewArt, fetchArtByUser, updateArt, deleteArt, fetchArtBySearch, fetchArtById,
  postComment, fetchArtComments, fetchSimilarArts, fetchRandomArtsFromUser
};
export type { PostArtResult };
