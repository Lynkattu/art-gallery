import pool from '../db/db.js'; // adjust path to your db.js location

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
                "SELECT artFilePath FROM arts ORDER BY RAND() LIMIT ?",
                [count]
            );

            console.log("Rows fetched:", rows);

            const arts = rows.map((art) => ({
                imageUrl: `http://localhost:5000/images/${art.artFilePath}`,
            }));

            res.json({ arts });

        } catch (err) {
            console.error("Error in /arts/random route:", err);
            res.status(500).json({ message: err.message });
        }
    });

    // Upload new art
    app.post("/arts", upload.single("uploaded_file"), async (req, res) => {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const { name, description } = req.body;

        try {
            await pool.query(
            "INSERT INTO arts (artFilePath, artName, artDescription) VALUES (?, ?, ?)",
            [req.file.filename, name, description]
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

}