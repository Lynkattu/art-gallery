import bcrypt from "bcryptjs";
import pool from '../db/db.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import authentication from '../middleware/authentication.js';

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
            //get id and password hash from db by email
            const [rows] = await pool.query(
                "SELECT id, password FROM users WHERE email = ?",
                [email]
            );
            //check if user exists
            if (rows.length === 0) {
                return res.status(400).json({ error: "Invalid email or password" });
            }
            const user = rows[0];
            //compare password with hash
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid email or password" });
            }
            //jwt token generation
            const token = jwt.sign(
                { email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            //set token in httpOnly cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: false, // set to true in production with HTTPS
                sameSite: "lax",
                maxAge: 15 * 60 * 1000
            });

            res.json({ message: "Logged in successfully" });
        } catch (err) {
            console.error("DB error during login:", err);
            res.status(500).json({ error: "Failed to login" });
        }
    });

    // User logout
    app.post("/users/logout", (req, res) => {
        res.clearCookie("token");
        res.json({ message: "Logged out" });
    });

    // Get user profile
    app.get("/users/profile", authentication, (req, res) => {
        res.json({ user: req.user });
    });
}