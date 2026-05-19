import "./ArtComments.css";
import { fetchArtComments, postComment } from "../../api/artAPI";
import { UserContext } from "../../contexts/userContext";
import { useContext, useEffect, useState } from "react";
import type { ArtComment } from "../../models/artCommentModel";

interface ArtCommentsProps {
    artId: string;
}

function ArtComments({ artId }: ArtCommentsProps) {
    const { user } = useContext(UserContext);
    const [artComments, setArtComments] = useState<ArtComment[] | null>(null);

    useEffect(() => {
        fetchComments();
    }, [artId]);

    async function fetchComments() {
        const comments = await fetchArtComments(artId);
        setArtComments(comments);
    }

    async function handleCommentSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();
        const form = e.currentTarget;
        if (!user) return;

        const formData = new FormData(e.currentTarget);
        const comment = formData.get("comment") as string;

        const response = await postComment(
            artId,
            user.id,
            comment
        );

        if (response.success) {
            fetchComments();
            form.reset();
        } else {
            console.error(response.error);
        }
    }

    return (
        user !== null ? (
            <div className="art-comments">
                <h5>Comments</h5>
                <form onSubmit={handleCommentSubmit}>
                    <textarea name="comment" placeholder="Write your comment here..." required></textarea>
                    <button type="submit">Post Comment</button>
                </form>
                <ul>
                    {artComments?.map((artComment, idx) => (
                        <li key={idx}>
                            <strong>{artComment.username}</strong> <em>{new Date(artComment.createdAt).toLocaleString()}</em>
                            <br />
                            <p>{artComment.comment}</p>
                        </li>
                    ))}
                </ul>
            </div>
        ) : (
            <div className="art-comments">
                <h5>Comments</h5>
                <ul>
                    {artComments?.map((artComment, idx) => (
                        <li key={idx}>
                            <strong>{artComment.username}</strong> <em>{new Date(artComment.createdAt).toLocaleString()}</em>
                            <br />
                            <p>{artComment.comment}</p>
                        </li>
                    ))}
                </ul>
            </div>
        )
    );
}

export default ArtComments;