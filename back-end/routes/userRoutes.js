import bcrypt from "bcryptjs";
import pool from '../db/db.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import authentication from '../middleware/authentication.js';
import transporter from '../utils/mailer.js';
import crypto from 'crypto';

export default function(app) {

    /**
     * @swagger
     * tags:
     *   name: Users
     *   description: User management and authentication
     */

    // User registration
    /**
     * @swagger
     * /users/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 required: true
     *                 description: The user's username
     *               firstName:
     *                 type: string
     *                 required: true
     *                 description: The user's first name
     *               lastName:
     *                 type: string
     *                 required: true
     *                 description: The user's last name
     *               email:
     *                 type: string
     *                 required: true
     *                 description: The user's email address
     *               password:
     *                 type: string
     *                 required: true
     *                 description: The user's password
     *     responses:
     *       201:
     *         description: User registered successfully
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
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
    /**
     * @swagger
     * /users/login:
     *   post:
     *     summary: Login a user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 required: true
     *                 description: The user's email address
     *               password:
     *                 type: string
     *                 required: true
     *                 description: The user's password
     *     responses:
     *       200:
     *         description: User logged in successfully
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
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
            //convert Buffer to hex string for JWT payload
            const userIdHex = user.id.toString("hex");
            //jwt token generation
            const token = jwt.sign(
                { id: userIdHex },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );
            //set token in httpOnly cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: false, // set to true in production with HTTPS
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            res.json({ message: "Logged in successfully" });
        } catch (err) {
            console.error("DB error during login:", err);
            res.status(500).json({ error: "Failed to login" });
        }
    });

    // User logout
    /**
     * @swagger
     * /users/logout:
     *   post:
     *     summary: Logout a user
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: User logged out successfully
     *       500:
     *         description: Internal server error
     */
    app.post("/users/logout", (req, res) => {
        res.clearCookie("token");
        res.json({ message: "Logged out" });
    });

    // Get user profile
    /**
     * @swagger
     * /users/profile:
     *   get:
     *     summary: Get the logged-in user's profile
     *     tags: [Users]
     *     security:
     *       - cookieAuth: []
      *     responses:
      *       200:
      *         description: The user's profile information
      *       400:
      *         description: User not found
      *       500:
      *         description: Internal server error
     */
    app.get("/users/profile", authentication, async (req, res) => {
        try {
            const { id } = req.user;
            // check if id exists
            if (!id) {
                console.log("Authentication failed: No user ID");
                return res.status(400).json({ error: "User not found" });
            }
            // convert back to BINARY(16)
            const userIdBuffer = Buffer.from(id, "hex");
            // get id and password hash from db by email
            const [rows] = await pool.query(
                "SELECT HEX(id) AS id, email, username, firstName, lastName FROM users WHERE id = ?",
                [userIdBuffer]
            );
            // check if user exists
            if (rows.length === 0) {
                console.log("User not found with ID:", id);
                return res.status(404).json({ error: "User not found" });
            }
            console.log("User profile fetched:",  rows[0].id);
            res.json({ user: rows[0] });
        } catch (err) {
            console.error("DB error fetching profile:", err);
            res.status(500).json({ error: "Failed to fetch profile" });
        }
    });

    /*
    |--------------------------------------------------------------------------
    | Send Password Reset Link
    |--------------------------------------------------------------------------
    */

    /**
     * @swagger
     * /users/forgot-password:
     *   post:
     *     summary: Send a password reset link to the user's email
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *             required:
     *               - email
     *     responses:
     *       200:
     *         description: Reset link sent successfully
     *       400:
     *         description: Invalid email format
     *       500:
     *         description: Internal server error
     */

    app.post("/users/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        // Check if user exists - but always return success message to prevent email enumeration
        if (users.length === 0) {
            return res.json({
                message:
                "If the email exists, a reset link was sent",
            });
        }

        const user = users[0];

        //Generate JWT
        const resetToken = jwt.sign(
            {
                userId: user.id,
                type: "password-reset",
            },
            process.env.JWT_RESET_SECRET,
            {
                expiresIn: "15m",
            }
        );

        //Hash JWT Before DB Storage
        const tokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Calculate expiration time (15 minutes from now)
        const expiresAt = new Date(
        Date.now() + 15 * 60 * 1000
        );

        //Invalidate Previous Tokens
        await pool.query(
            `
            UPDATE password_resets
            SET used_at = NOW()
            WHERE user_id = ?
            AND used_at IS NULL
            `,
            [user.id]
        );

        //Generate Unique ID for Token Record
        const id = uuidv4().replace(/-/g, '');

        //Store Token Record
        await pool.query(
            `
            INSERT INTO password_resets
            (id,user_id, token_hash, expires_at)
            VALUES (UNHEX(?), ?, ?, ?)
            `,
            [id, user.id, tokenHash, expiresAt]
        );

        //Reset URL - Frontend route that the user will visit to reset their password
        const resetUrl =
        `${process.env.FRONTEND_URL}` +
        `/reset-password/${resetToken}`;

        //Send Email
        await transporter.sendMail({
            to: user.email,
            subject: "Reset Your Password",
            html: `
                <h2>Password Reset</h2>
                <p>
                Click below to reset your password:
                </p>
                <a href="${resetUrl}">
                Reset Password
                </a>
                <p>
                Link expires in 15 minutes.
                </p>
            `,
        });

        return res.json({
        message:
            "If the email exists, a reset link was sent",
        });

        } catch (err) {
            console.error(err);

        return res.status(500).json({
            message: "Server error",
        });
        }
    });

    /*
    |--------------------------------------------------------------------------
    | RESET PASSWORD
    |--------------------------------------------------------------------------
    */
    /**
     * @swagger
     * /users/reset-password:
     *   post:
     *     summary: Reset the user's password using a valid reset token
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               token:
     *                 type: string
     *                 description: The password reset token sent to the user's email
     *               password:
     *                 type: string
     *                 description: The new password to set for the user
     *             required:
     *               - token
     *               - password
     *     responses:
     *       200:
     *         description: Password reset successfully
     *       400:
     *         description: Invalid or expired token, or invalid token type
     *       500:
     *         description: Internal server error
     */

    app.post("/reset-password", async (req, res) => {
        try {
            const { token, password } = req.body;

            //Verify JWT Signature and Expiration
            let decoded;

            try {
                decoded = jwt.verify(
                    token,
                    process.env.JWT_RESET_SECRET
                );
            } catch (err) {
            return res.status(400).json({
                message: "Invalid or expired token",
            });
            }
            // Validate Token Type
            if (decoded.type !== "password-reset") {
                return res.status(400).json({
                    message: "Invalid token type",
                });
            }
            // Hash Incoming JWT
            const tokenHash = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");

            //Find Token Record
            const [rows] = await pool.query(
                `
                SELECT *
                FROM password_resets
                WHERE token_hash = ?
                AND used_at IS NULL
                AND expires_at > NOW()
                LIMIT 1
                `,
                [tokenHash]
            );

            if (rows.length === 0) {
                return res.status(400).json({
                    message: "Invalid or expired token",
                });
            }

            const resetRecord = rows[0];

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Update User Password
        await pool.query(
            `
            UPDATE users
            SET password = ?
            WHERE id = ?
            `,
            [hashedPassword, decoded.userId]
        );

        // Mark Token Used
        await pool.query(
            `
            UPDATE password_resets
            SET used_at = NOW()
            WHERE id = ?
            `,
            [resetRecord.id]
        );

        return res.json({
            message: "Password reset successful",
        });

        } catch (err) {
            console.error(err);

            return res.status(500).json({
                message: "Server error",
            });
        }
    });
}