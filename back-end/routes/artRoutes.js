import pool from '../db/db.js'; // adjust path to your db.js location
import { v4 as uuidv4 } from 'uuid';
import { rootPath } from 'get-root-path';
import fs from 'fs/promises';
import authentication from '../middleware/authentication.js';
import path from 'path';



export default function(app, upload) {

    // Get random art paths
    app.get("/arts/random/:count", async (req, res) => {
        try {
            const count = parseInt(req.params.count, 10);
            console.log("Requested count:", count);

            if (isNaN(count) || count <= 0) {
                return res.status(400).json({ message: "Invalid count" });
            }

            const [rows] = await pool.query(
                "SELECT filePath FROM arts ORDER BY RAND() LIMIT ?",
                [count]
            );

            console.log("Rows fetched:", rows);

            const arts = rows.map((art) => ({
                imageUrl: `http://localhost:5000/images/${art.filePath}`,
            }));
            
            res.json({ arts });

        } catch (err) {
            console.error("Error in /arts/random route:", err);
            res.status(500).json({ message: err.message });
        }
    });

    //get art by id
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
    app.get("/arts", async (req, res) => {
        try {
            const { type, search } = req.query;
            if (!type || !search) { 
                return res.status(400).json({ message: "Both type and search parameters are required" });
            }
            let query;
            if (type === "Art") {
                [query] = await pool.query(
                    `SELECT a.*, HEX(a.id) as id, u.username
                    FROM arts a
                    JOIN users u ON a.user_id = u.id
                    WHERE a.title LIKE ?`,
                    [`%${search}%`]
                );
            } else if (type === "Artist") {
                [query] = await pool.query(
                    `SELECT a.*, HEX(a.id) as id, u.username
                    FROM arts a
                    JOIN users u ON a.user_id = u.id
                    WHERE u.username LIKE ?`,
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
                imageUrl: `http://localhost:5000/images/${art.filePath}`
            }));
            res.status(200).json({arts});
        } catch (err) {
            console.error("Error during search:", err);
            res.status(500).json({ message: "error occurred during search" });
        }
    });

    // Upload new art
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
}