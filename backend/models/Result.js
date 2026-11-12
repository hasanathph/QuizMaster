
const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    score: {
        type: Number,
        required: true
    },

    totalQuestions: {
        type: Number,
        required: true
    }

}, { timestamps: true });

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
