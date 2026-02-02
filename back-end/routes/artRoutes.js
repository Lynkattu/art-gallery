import pool from '../db/db.js'; // adjust path to your db.js location
import { v4 as uuidv4 } from 'uuid';
import { rootPath } from 'get-root-path';
import fs from 'fs';



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

    // Upload new art
    app.post("/arts", upload.single("uploaded_file"), async (req, res) => {

        try {
            if (!req.file) return res.status(400).json({ error: "No file uploaded" });

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
    app.put('/arts/:id', async (req, res) => {
        console.log("trying to update art: ", req.params.id)
        try {
            const {title, description} = req.body;
            const result = await pool.query(
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
            console.log(result)
            res.status(200).json({message: "Art updated succesfully"})

        } catch (err) {
            console.error("Art failed to update:", req.params.id)
            res.status(500).json({error: err})
        }
    });

    // get arts posted by user
    app.get('/arts/artist/:id', async (req, res) => {
        console.log(`try to fetch art from user: ${req.params.id}`)
        try {
            const [rows] = await pool.query(
                'SELECT HEX(id) AS id, title, description, filePath FROM arts WHERE user_id = UNHEX(?)',
                [req.params.id]
            );

            const arts = rows.map((art) => ({
                id: art.id,
                title: art.title,
                description: art.description,
                imageUrl: `http://localhost:5000/images/${art.filePath}`
            }));
            
            console.log(`user: ${req.params.id} arts fetched successfully.`)
            res.status(200).json({arts});

        } catch (err) {
            console.log(`user: ${req.params.id} arts fetch failed.`)
            res.status(500).json({error: err});
        }
    });
}

