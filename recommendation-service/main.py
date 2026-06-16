from fastapi import FastAPI, HTTPException
from database import get_connection
#from similarity_service import cosine_similarity
import json

# python -m uvicorn main:app --reload

app = FastAPI()

@app.get("/")
def read_root():
    return {"Welcome to the Art Recommendation Service!"}


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