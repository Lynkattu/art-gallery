import pool from '../db/db.js'; // adjust path to your db.js location
import { v4 as uuidv4 } from 'uuid';
import { rootPath } from 'get-root-path';
import fs from 'fs/promises';
import authentication from '../middleware/authentication.js';
import path from 'path';



export default function(app, upload) {
    /** 
     * @swagger
     * tags:
     *   name: Arts
     *   description: API endpoints for managing art pieces
    */

    // Get random art paths
    /**
     * @swagger
     * /arts/random/{count}:
     *   get:
     *     tags: [Arts]
     *     summary: Get random art pieces
     *     parameters:
     *       - in: path
     *         name: count
     *         schema:
     *           type: integer
     *         required: true
     *         description: Number of random art pieces to fetch
     *     responses:
     *        200:
     *          description: A list of random art pieces
     *        400:
     *          description: Invalid count
     *        500:
     *          description: Internal server error
     */
    app.get("/arts/random/:count", async (req, res) => {
        try {
            const count = parseInt(req.params.count, 10);
            console.log("Requested count:", count);

            if (isNaN(count) || count <= 0) {
                return res.status(400).json({ message: "Invalid count" });
            }

            const [rows] = await pool.query(
                `SELECT 
                    a.title, 
                    a.description, 
                    a.filePath,
                    a.created_at,
                    HEX(a.id) AS id, 
                    u.username,
                    GROUP_CONCAT(t.name) AS tags
                FROM arts a
                JOIN users u ON a.user_id = u.id
                LEFT JOIN art_tags at ON a.id = at.art_id
                LEFT JOIN tags t ON at.tag_id = t.id
                GROUP BY 
                    a.id, 
                    a.title, 
                    a.description, 
                    a.filePath, 
                    a.created_at, 
                    u.username
                ORDER BY RAND() LIMIT ?`,
                [count]
            );

            console.log("Rows fetched:", rows);

            const arts = rows.map((art) => ({
                id: art.id,
                title: art.title,
                description: art.description,
                artist: art.username,
                createdAt: art.created_at,
                tags: art.tags ? art.tags.split(',') : [],
                imageUrl: `http://localhost:5000/images/${art.filePath}`
            }));
            
            res.json({ arts });

        } catch (err) {
            console.error("Error in /arts/random route:", err);
            res.status(500).json({ message: err.message });
        }
    });

    //get art by id
    /** 
     * @swagger
     * /arts/{id}:
     *   get:
     *     tags: [Arts]
     *     summary: Get art by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the art piece to fetch
     *     responses:
     *        200:
     *          description: The art piece with the specified ID
     *        404:
     *          description: Art piece not found
     *        500:
     *          description: Internal server error
     */
    app.get("/arts/:id", async (req, res) => {
        try {
            const artId = req.params.id;
            console.log("Fetching art with ID:", artId);

            const [rows] = await pool.query(
                `SELECT a.*, u.username
                FROM arts a
                JOIN users u ON a.user_id = u.id
                WHERE a.id = UNHEX(?)`,
                [artId]
            );

            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: "Art not found" });
            }

            const art = rows[0];
            const artData = {
                id: artId,
                title: art.title,
                description: art.description,
                artist: art.username,
                createdAt: art.created_at,
                imageUrl: `http://localhost:5000/images/${art.filePath}`
            };

            console.log("Art fetched successfully:", artData);
            res.status(200).json({ art: artData });

        } catch (err) {
            console.error("Error fetching art by ID:", err);
            res.status(500).json({ message: "Failed to fetch art" });
        }
    });

    // Search for art by title or artist
    /** 
     * @swagger
     * /arts:
     *   get:
     *     tags: [Arts]
     *     summary: Search for art by title & description & tags or by artist user name
     *     parameters:
     *       - in: query
     *         name: type
     *         schema:
     *           type: string
     *         required: true
     *         description: The type of search (Art or Artist)
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         required: true
     *         description: The search term
     *     responses:
     *       200:
     *         description: A list of art pieces matching the search criteria
     *       400:
     *         description: Invalid search parameters
     *       404:
     *         description: No art pieces found
     *       500:
     *         description: Internal server error
     */
    app.get("/arts", async (req, res) => {
        try {
            const { type, search } = req.query;
            if (!type || !search) { 
                return res.status(400).json({ message: "Both type and search parameters are required" });
            }
            let query;
            if (type === "Art") {
                [query] = await pool.query(
                    `SELECT 
                        a.title, 
                        a.description, 
                        a.filePath,
                        a.created_at,
                        HEX(a.id) AS id, 
                        u.username,
                        GROUP_CONCAT(t.name) AS tags
                    FROM arts a
                    JOIN users u ON a.user_id = u.id
                    LEFT JOIN art_tags at ON a.id = at.art_id
                    LEFT JOIN tags t ON at.tag_id = t.id
                    WHERE 
                        a.title LIKE ?
                        OR a.description LIKE ?
                        OR t.name LIKE ?
                    GROUP BY 
                        a.id, 
                        a.title, 
                        a.description, 
                        a.filePath, 
                        a.created_at, 
                        u.username`,
                    [`%${search}%`, `%${search}%`, `%${search}%`]
                );
            } else if (type === "Artist") {
                [query] = await pool.query(
                    `SELECT 
                        a.title, 
                        a.description, 
                        a.filePath,
                        a.created_at,
                        HEX(a.id) AS id, 
                        u.username,
                        GROUP_CONCAT(t.name) AS tags
                    FROM arts a
                    JOIN users u ON a.user_id = u.id
                    LEFT JOIN art_tags at ON a.id = at.art_id
                    LEFT JOIN tags t ON at.tag_id = t.id
                    WHERE u.username LIKE ?
                    GROUP BY 
                        a.id, 
                        a.title, 
                        a.description, 
                        a.filePath, 
                        a.created_at, 
                        u.username`,
                    [`%${search}%`]
                );
            } else {
                return res.status(400).json({ message: "Invalid search type" });
            }

            if (!query || query.length === 0) {
                return res.status(404).json({ message: "No art found with the given title or artist" });
            }

            const arts = query.map((art) => ({
                id: art.id,
                title: art.title,
                description: art.description,
                artist: art.username,
                createdAt: art.created_at,
                tags: art.tags ? art.tags.split(',') : [],
                imageUrl: `http://localhost:5000/images/${art.filePath}`
            }));
            res.status(200).json({arts});
        } catch (err) {
            console.error("Error during search:", err);
            res.status(500).json({ message: "error occurred during search" });
        }
    });

    // Upload new art
    /** 
     * @swagger
     * /arts:
     *   post:
     *     tags: [Arts]
     *     summary: Upload a new art piece
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *               user_id:
     *                 type: string
     *               tags:
     *                 type: array
     *                 items:
     *                   type: string
     *             required:
     *               - title
     *               - description
     *               - user_id
     *     security:
     *      - bearerAuth: []
     *     responses:
     *       201:
     *         description: Art piece uploaded successfully
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
    app.post("/arts", upload.single("uploaded_file"), authentication, async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ error: "No file uploaded" });
            // Validate required fields
            const { title, description, user_id } = req.body;
            if (!title || !description || !user_id) {
                await fs.unlink(path.join(rootPath, `images/${req.file.filename}`)); // delete the uploaded file
                return res.status(400).json({ error: "Title, description, and user_id are required" });
            }
            // generate a UUID for the user ID
            const id = uuidv4().replace(/-/g, '');

            await pool.query(
                "INSERT INTO arts (id, filePath, title, description, user_id) VALUES (UNHEX(?), ?, ?, ?, UNHEX(?))",
                [id, req.file.filename, title, description, user_id]
            );

            // Handle tags
            let tagsId = [];  // to store tag IDs for the art
            let tagsToInsert = []; // to store new tags that need to be inserted

            // Check existing tags if provided
            if (req.body.tags) {
                const tags = JSON.parse(req.body.tags);
                const [rows] = await pool.query(
                    "SELECT HEX(id) as id, name FROM tags WHERE name IN (?)",
                    [tags]
                );
                tagsId = rows.map(row => row.id);
                const existing_tags = rows.map(row => row.name);
                tagsToInsert = tags.filter(tag => !existing_tags.includes(tag));
            }

            // Insert tags if provided
            console.log("Tags to insert:", tagsToInsert);
            if (tagsToInsert.length > 0) {
                for (const tag of tagsToInsert) {
                    const tagId = uuidv4().replace(/-/g, '');
                    await pool.query(
                        "INSERT INTO tags (id, name) VALUES (UNHEX(?), ?)",
                        [tagId, tag]
                    );
                    tagsId.push(tagId);
                }
            }

            // Insert into art_tags
            console.log("Tag IDs for art:", tagsId);
            if (tagsId.length > 0) {
                const placeholders = tagsId
                    .map(() => "(UNHEX(?), UNHEX(?))")
                    .join(",");

                const values = tagsId.flatMap(tagId => [id, tagId]);

                await pool.query(
                    `INSERT INTO art_tags (art_id, tag_id)
                    VALUES ${placeholders}`,
                    values
                );
            }

            res.status(201).json({ message: "Art uploaded successfully" });
        } catch (err) {
            console.error("DB error inserting art:", err);
            res.status(500).json({ error: "Failed to upload art" });
        }
    });

    // Download image endpoint
    // filename => filename in image directory
    app.get('/arts/download/:filename', async (req, res) => {
        res.download(`images/${req.params.filename}`);
    }); 

    // update existing art
    /** 
     * @swagger
     * /arts/{id}:
     *   put:
     *     tags: [Arts]
     *     summary: Update an existing art piece
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the art piece to update
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *               tags:
     *                 type: array
     *                 items:
     *                   type: string
     *     security:
     *      - bearerAuth: []
     *     responses:
     *       200:
     *         description: Art piece updated successfully
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
    app.put('/arts/:id', authentication, async (req, res) => {
        console.log("trying to update art: ", req.params.id)
        const conn = await pool.getConnection();

        try {
            const {title, description, tags} = req.body;

            await conn.beginTransaction();

            // Update art details only if they have changed
            const [result] = await pool.query(
            `
            UPDATE arts
            SET title = ?, description = ?
            WHERE id = UNHEX(?)
                AND NOT (
                title <=> ?
                AND description <=> ?
                )
            `,
            [title, description, req.params.id, title, description]
            );

            // Handle tags
            await conn.query(
                `DELETE FROM art_tags WHERE art_id = UNHEX(?)`,
                [req.params.id]
            );

            if (tags && tags.length > 0) {
                await conn.query(
                    `INSERT INTO tags (id, name)
                    VALUES ${tags.map(() => `(UNHEX(REPLACE(UUID(), '-', '')), ?)`).join(',')}
                    ON DUPLICATE KEY UPDATE name = name`,
                    tags
                );

                await conn.query(
                    `INSERT INTO art_tags (art_id, tag_id)
                    SELECT UNHEX(?), id FROM tags WHERE name IN (${tags.map(() => '?').join(',')})`,
                    [req.params.id, ...tags]
                );
            }

            await conn.commit();

            console.log("Art updated:", result);
            res.status(200).json({ message: "Art updated successfully" });

        } catch (err) {
            await conn.rollback();
            console.error("Art failed to update:", req.params.id);
            console.error("Error details:", err);
            res.status(500).json({ error: "Failed to update art" });
        } finally {
            conn.release();
        }
    });

    //delete art by id
    /** 
     * @swagger
     * /arts/{id}:
     *   delete:
     *     tags: [Arts]
     *     summary: Delete an art piece by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the art piece to delete
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Art piece deleted successfully
     *       404:
     *         description: Art piece not found
     *       500:
     *         description: Internal server error
     */
    app.delete('/arts/:id', authentication, async (req, res) => {
        const artId = req.params.id;
        console.log("Deleting art:", artId);

        try {
            // SELECT file path
            const [rows] = await pool.query(
                `SELECT filePath FROM arts WHERE id = UNHEX(?)`,
                [artId]
            );

            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: "Art not found" });
            }

            const filePath = rows[0]?.filePath;

            // DELETE file safely
            if (filePath) {
                const fullPath = path.join(rootPath, "images", path.basename(filePath));
                try {
                    await fs.unlink(fullPath);
                    console.log("Deleted file:", fullPath);
                } catch (err) {
                    if (err.code !== "ENOENT") console.warn("File delete error:", err.message);
                }
            }

            // DELETE from database
            const [result] = await pool.query(
                `DELETE FROM arts WHERE id = UNHEX(?)`,
                [artId]
            );

            if (!result || result.affectedRows === 0) {
                return res.status(404).json({ message: "Art not found" });
            }

            res.status(200).json({ message: "Art deleted successfully" });

        } catch (err) {
            console.error("DELETE ART ERROR:", err);
            res.status(500).json({ message: "Failed to delete art" });
        }
    });


    // get arts by user
    /** 
     * @swagger
     * /arts/artist/{id}:
     *   get:
     *     tags: [Arts]
     *     summary: Get arts by artist ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the artist
     *     responses:
     *       200:
     *         description: A list of art pieces by the specified artist
     *       404:
     *         description: Artist not found
     *       500:
     *         description: Internal server error
     */
    app.get('/arts/artist/:id', async (req, res) => {
        console.log(`try to fetch art from user: ${req.params.id}`)
        try {
            const [rows] = await pool.query(
                `SELECT 
                    HEX(a.id) AS id, 
                    a.title, 
                    a.description, 
                    a.filePath, 
                    GROUP_CONCAT(t.name) AS tags
                FROM arts a
                LEFT JOIN art_tags at ON a.id = at.art_id
                LEFT JOIN tags t ON at.tag_id = t.id
                WHERE a.user_id = UNHEX(?)
                GROUP BY a.id, a.title, a.description, a.filePath`,
                [req.params.id]
            );

            const arts = rows.map((art) => ({
                id: art.id,
                title: art.title,
                description: art.description,
                imageUrl: `http://localhost:5000/images/${art.filePath}`,
                tags: art.tags ? art.tags.split(',') : [] // split tags into an array
            }));
            console.log(`Fetched arts from user ${req.params.id}:`, arts);
            console.log(`user: ${req.params.id} arts fetched successfully.`)
            res.status(200).json({arts});

        } catch (err) {
            console.log(`user: ${req.params.id} arts fetch failed.`)
            res.status(500).json({error: err});
        }
    });

    // post comment to art
    /** 
     * @swagger
     * /arts/{id}/comments:
     *   post:
     *     tags: [Arts]
     *     summary: Post a comment to an art piece
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the art piece to comment on
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user_id:
     *                 type: string
     *               comment:
     *                 type: string
     *             required:
     *               - user_id
     *               - comment_text
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       201:
     *         description: Comment posted successfully
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
    app.post('/arts/:id/comments', authentication, async (req, res) => {
        const artId = req.params.id;
        const { user_id, comment_text } = req.body;

        // Validate required fields
        if (!user_id || !comment_text) {
            return res.status(400).json({ message: "One or more required fields are missing" });
        }

        try {
            // generate a UUID for the comment ID
            const id = uuidv4().replace(/-/g, '');

            // Insert the comment into the database
            await pool.query(
                `INSERT INTO comments (id, art_id, user_id, comment_text) VALUES (UNHEX(?), UNHEX(?), UNHEX(?), ?)`,
                [id, artId, user_id, comment_text]
            );
            res.status(201).json({ message: "Comment posted successfully" });
        } catch (err) {
            console.error("Error adding comment:", err);
            res.status(500).json({ message: "Failed to add comment" });
        }
    });

    // get comments for an art piece
    /** 
     * @swagger
     * /arts/{id}/comments:
     *   get:
     *     tags: [Arts]
     *     summary: Get comments for an art piece
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the art piece to fetch comments for
     *     responses:
     *       200:
     *         description: A list of comments for the specified art piece
     *       404:
     *         description: Art piece not found
     *       500:
     *         description: Internal server error
     */
    app.get('/arts/:id/comments', async (req, res) => {
        const artId = req.params.id;

        try {
            // Search for comments related to the specified art piece
            const [rows] = await pool.query(
                `SELECT c.comment, c.created_at, u.username
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.art_id = UNHEX(?)`,
                [artId]
            );
            // Map the comments to a more readable format
            const comments = rows.map((comment) => ({
                comment: comment.comment,
                createdAt: comment.created_at,
                username: comment.username
            }));

            res.status(200).json({ comments });
        } catch (err) {
            console.error("Error fetching comments:", err);
            res.status(500).json({ message: "Failed to fetch comments" });
        }
    });

    // delete comment by id
    /** 
     * @swagger
     * /arts/{artId}/comments/{commentId}:
     *   delete:
     *     tags: [Arts]
     *     summary: Delete a comment by ID
     *     parameters:
     *       - in: path
     *         name: artId
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the art piece the comment belongs to
     *       - in: path
     *         name: commentId
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the comment to delete
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Comment deleted successfully
     *       404:
     *         description: Comment not found
     *       500:
     *         description: Internal server error
     */
    app.delete('/arts/:artId/comments/:commentId', authentication, async (req, res) => {
        const { artId, commentId } = req.params;

        try {
            // Delete the comment from the database
            const [result] = await pool.query(
                `DELETE FROM comments WHERE id = UNHEX(?) AND art_id = UNHEX(?)`,
                [commentId, artId]
            );

            if (!result || result.affectedRows === 0) {
                return res.status(404).json({ message: "Comment not found" });
            }

            res.status(200).json({ message: "Comment deleted successfully" });
        } catch (err) {
            console.error("Error deleting comment:", err);
            res.status(500).json({ message: "Failed to delete comment" });
        }
    });
}