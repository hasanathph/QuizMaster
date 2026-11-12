
const express = require("express");
const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// ADMIN LOGIN
router.post("/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            return res.status(500).json({
                message: "Admin credentials are not configured"
            });
        }

        if (
            email === ADMIN_EMAIL &&
            password === ADMIN_PASSWORD
        ) {
            return res.status(200).json({
                message: "Admin login successful"
            });
        }

        return res.status(401).json({
            message: "Invalid admin email or password"
        });

    } catch (error) {
        console.log("Admin Login Error:", error);

        return res.status(500).json({
            message: "Admin login failed"
        });
    }
});

module.exports = router;
