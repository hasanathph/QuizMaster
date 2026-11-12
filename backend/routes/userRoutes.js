
const express = require("express");
const router = express.Router();

const User = require("../models/user");
const bcrypt = require("bcryptjs");

// User Registration
router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check empty fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "Registration successful"
        });

    } catch (error) {

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });

    }

});

// USER LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});

// UPDATE USER PROFILE
router.put("/profile", async (req, res) => {
    try {
        const { id, name, email } = req.body;

        if (!id || !name || !email) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            email,
            _id: { $ne: id }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Profile update failed",
            error: error.message
        });
    }
});

// VIEW ALL REGISTERED USERS
router.get("/users", async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
});

module.exports = router;
