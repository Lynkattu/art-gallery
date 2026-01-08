import bcrypt from "bcryptjs";
import pool from '../db/db.js';
import { v4 as uuidv4 } from 'uuid';

export default function(app) {

    // User registration
    app.post("/users/register", async (req, res) => {
        const { username, firstName, lastName, email, password } = req.body;
        // Validation
        if (!username || !firstName || !lastName || !email || !password) {
            console.log("Validation failed: Missing fields");
            return res.status(400).json({ error: "All fields are required" });
        }
        try {
            // hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            // generate a UUID for the user ID
            const id = uuidv4().replace(/-/g, '');
            await pool.query(
                "INSERT INTO users (id, username, firstName, lastName, email, password) VALUES (UNHEX(?), ?, ?, ?, ?, ?)",
                [id, username, firstName, lastName, email, hashedPassword]
            );
            console.log("User registered:", [username, email]);
            res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
            console.error("DB error registering user:", err);
            res.status(500).json({ error: "Failed to register user" });
        }
    });

    // User login
    app.post("/users/login", async (req, res) => {
        const { email, password } = req.body;
        try {
            const [rows] = await pool.query(
                "SELECT id, password FROM users WHERE email = ?",
                [email]
            );
            if (rows.length === 0) {
                return res.status(400).json({ error: "Invalid email or password" });
            }
            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid email or password" });
            }
            res.json({ message: "Login successful", userId: user.id });
        } catch (err) {
            console.error("DB error during login:", err);
            res.status(500).json({ error: "Failed to login" });
        }
    });
}