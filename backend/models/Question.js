
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    question: {
        type: String,
        required: true,
        trim: true
    },

    options: {
        type: [String],
        required: true,
        validate: {
            validator: function(value) {
                return value.length === 4 &&
                    value.every(option => option.trim() !== "");
            },
            message: "Exactly four options are required"
        }
    },

    correctAnswer: {
        type: String,
        required: true
    }

}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
