

const express = require("express");
const router = express.Router();

const Question = require("../models/Question");
const Category = require("../models/category");
const Result = require("../models/Result");

// Convert A/B/C/D into the actual option text if needed
function getCorrectAnswer(options, answer) {
    const cleanedAnswer = String(answer).trim();

    const letters = ["A", "B", "C", "D"];
    const letterIndex = letters.indexOf(cleanedAnswer.toUpperCase());

    if (letterIndex !== -1) {
        return options[letterIndex];
    }

    return cleanedAnswer;
}

// ADD QUESTION
router.post("/question", async (req, res) => {
    try {
        const { category, question, options, correctAnswer } = req.body;

        if (!category || !question || !options || !correctAnswer) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (
            !Array.isArray(options) ||
            options.length !== 4 ||
            options.some(option => typeof option !== "string" || !option.trim())
        ) {
            return res.status(400).json({
                message: "Exactly four filled options are required"
            });
        }

        const cleanOptions = options.map(option => option.trim());
        const cleanAnswer = getCorrectAnswer(cleanOptions, correctAnswer);

        if (!cleanOptions.some(option =>
            option.toLowerCase() === cleanAnswer.toLowerCase()
        )) {
            return res.status(400).json({
                message: "Correct answer must match one of the options"
            });
        }

        const existingCategory = await Category.findById(category);

        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        const newQuestion = new Question({
            category,
            question: question.trim(),
            options: cleanOptions,
            correctAnswer: cleanOptions.find(
                option => option.toLowerCase() === cleanAnswer.toLowerCase()
            )
        });

        await newQuestion.save();

        res.status(201).json({
            message: "Question added successfully",
            question: newQuestion
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add question",
            error: error.message
        });
    }
});


// VIEW QUESTIONS BY CATEGORY
// GET ALL QUESTIONS
router.get("/questions", async (req, res) => {
    try {
        const filter = {};

        if (req.query.categoryId) {
            filter.category = req.query.categoryId;
        }

        const questions = await Question.find(filter)
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(questions);

    } catch (error) {
        console.log("Fetch Questions Error:", error);

        res.status(500).json({
            message: "Failed to fetch questions",
            error: error.message
        });
    }
});

// UPDATE QUESTION
router.put("/question/:id", async (req, res) => {
    try {
        const { category, question, options, correctAnswer } = req.body;

        if (!category || !question || !options || !correctAnswer) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (
            !Array.isArray(options) ||
            options.length !== 4 ||
            options.some(option => typeof option !== "string" || !option.trim())
        ) {
            return res.status(400).json({
                message: "Exactly four filled options are required"
            });
        }

        const cleanOptions = options.map(option => option.trim());
        const cleanAnswer = getCorrectAnswer(cleanOptions, correctAnswer);

        if (!cleanOptions.some(option =>
            option.toLowerCase() === cleanAnswer.toLowerCase()
        )) {
            return res.status(400).json({
                message: "Correct answer must match one of the options"
            });
        }

        const existingCategory = await Category.findById(category);

        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            {
                category,
                question: question.trim(),
                options: cleanOptions,
                correctAnswer: cleanOptions.find(
                    option => option.toLowerCase() === cleanAnswer.toLowerCase()
                )
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedQuestion) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        res.status(200).json({
            message: "Question updated successfully",
            question: updatedQuestion
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update question",
            error: error.message
        });
    }
});


// DELETE QUESTION
router.delete("/question/:id", async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

        if (!deletedQuestion) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        res.status(200).json({
            message: "Question deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete question",
            error: error.message
        });
    }
});


// VIEW ALL QUIZ RESULTS
// VIEW QUIZ RESULTS
router.get("/results", async (req, res) => {
    try {
        const filter = {};

        // If userId is provided, show only that user's results.
        if (req.query.userId) {
            filter.user = req.query.userId;
        }

        const results = await Result.find(filter)
            .populate("user", "name email")
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.json(results);

    } catch (error) {
        console.log("Results Error:", error);
        res.status(500).json({
            message: "Unable to fetch quiz results"
        });
    }
});

// SUBMIT QUIZ AND SAVE RESULT
router.post("/quiz/submit", async (req, res) => {
    try {
        const { userId, categoryId, answers } = req.body;

        if (!userId || !categoryId || !Array.isArray(answers)) {
            return res.status(400).json({
                message: "Required quiz details are missing"
            });
        }

        // Fetch questions WITH correct answers
        const questions = await Question.find({
            category: categoryId
        });

        if (questions.length === 0) {
            return res.status(404).json({
                message: "No questions found"
            });
        }

        // Store submitted answers using question ID
        const answerMap = {};

        answers.forEach(item => {
            if (item.questionId && typeof item.selectedAnswer === "string") {
                answerMap[String(item.questionId)] = item.selectedAnswer.trim();
            }
        });

        // Calculate score
        let score = 0;

        questions.forEach(question => {
            const userAnswer = answerMap[question._id.toString()];
            const correctAnswer = getCorrectAnswer(
                question.options,
                question.correctAnswer
            );

            if (
                userAnswer &&
                userAnswer.toLowerCase() === correctAnswer.trim().toLowerCase()
            ) {
                score++;
            }
        });

        // Save result in MongoDB
        const result = new Result({
            user: userId,
            category: categoryId,
            score,
            totalQuestions: questions.length
        });

        await result.save();

        res.status(201).json({
            message: "Quiz submitted successfully",
            score,
            totalQuestions: questions.length,
            resultId: result._id
        });

    } catch (error) {
        res.status(500).json({
            message: "Quiz submission failed",
            error: error.message
        });
    }
});
// LEADERBOARD
router.get("/leaderboard", async (req, res) => {
    try {

        const results = await Result.find()
            .populate("user", "name")
            .sort({ createdAt: -1 });

        const leaderboard = {};

        results.forEach(function(item) {

            if (!item.user) {
                return;
            }

            const userId = item.user._id.toString();

            if (!leaderboard[userId]) {
                leaderboard[userId] = {
                    userId: userId,
                    name: item.user.name,
                    quizzesAttended: 0,
                    totalScore: 0
                };
            }

            leaderboard[userId].quizzesAttended += 1;
            leaderboard[userId].totalScore += Number(item.score) || 0;

        });

        const rankedUsers = Object.values(leaderboard);

        rankedUsers.sort(function(a, b) {
            return b.totalScore - a.totalScore ||
                   b.quizzesAttended - a.quizzesAttended;
        });

        res.json(rankedUsers);

    } catch (error) {

        console.log("Leaderboard Error:", error);

        res.status(500).json({
            message: "Unable to load leaderboard"
        });
    }
});
module.exports = router;
