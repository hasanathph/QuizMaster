

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS Configuration
app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ]
}));

app.use(express.json());

// User Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

// Category Routes
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api", categoryRoutes);

// Question Routes
const questionRoutes = require("./routes/questionRoutes");
app.use("/api", questionRoutes);

// Admin Routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api", adminRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });

// Home Route
app.get("/", (req, res) => {
    res.send("QuizMaster Backend is Running!");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
