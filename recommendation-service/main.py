from fastapi import FastAPI, HTTPException
from database import get_connection
from embedding_service import get_embedding
#from similarity_service import cosine_similarity
import json
from pydantic import BaseModel, field_validator


# python -m uvicorn main:app --reload

class EmbeddingRequest(BaseModel):
    file_path: str

    @field_validator("file_path")
    def validate_file_path(cls, value):
        if not value:
            raise ValueError("file_path must not be empty")
        return value

app = FastAPI()

@app.get("/")
def read_root():
    return {"Welcome to the Art Recommendation Service!"}

@app.post("/embeddings/{art_id}")
async def create_embedding(art_id: str, request: EmbeddingRequest):
    # connect to th database
    conn = get_connection()
    # get the embedding for the provided image
    embedding = get_embedding(f'''../back-end/images/{request.file_path}''')

    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO art_embeddings (art_id, embedding)
            VALUES (UNHEX(REPLACE(%s, '-', '')), %s)
            ON DUPLICATE KEY UPDATE embedding = VALUES(embedding)
        """, (art_id, embedding.tobytes()))

    return {"message": "Embedding created successfully"}

'''
@app.get("/recommendations/{art_id}")
def get_similar_artworks(
    art_id: str,
    limit: int = 10
):

    conn = get_connection()

    with conn.cursor() as cursor:

        cursor.execute("""
            SELECT embedding
            FROM art_embeddings
            WHERE art_id = UNHEX(REPLACE(%s, '-', ''))
        """, (art_id,))

        target = cursor.fetchone()

        if not target:
            raise HTTPException(
                status_code=404,
                detail="Artwork embedding not found"
            )

        target_embedding = json.loads(target[0])

        cursor.execute("""
            SELECT
                HEX(a.id) as id,
                a.title,
                a.filePath,
                e.embedding
            FROM arts a
            JOIN art_embeddings e
                ON a.id = e.art_id
        """)

        recommendations = []

        for row in cursor.fetchall():

            embedding = json.loads(row[3])

            score = cosine_similarity(
                target_embedding,
                embedding
            )

            recommendations.append({
                "id": row[0],
                "title": row[1],
                "filePath": row[2],
                "score": float(score)
            })

        recommendations.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        recommendations = [
            item
            for item in recommendations
            if item["id"].lower().replace("-", "")
            != art_id.lower().replace("-", "")
        ]

        return recommendations[:limit]
'''