
const express = require("express");
const router = express.Router();

const Category = require("../models/category");

// VIEW ALL CATEGORIES
router.get("/categories", async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        res.status(200).json(categories);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch categories",
            error: error.message
        });
    }
});

// ADD CATEGORY
router.post("/category", async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({
            name: name.trim()
        });

        if (existingCategory) {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        const newCategory = new Category({
            name: name.trim(),
            description: description || ""
        });

        await newCategory.save();

        res.status(201).json({
            message: "Category added successfully",
            category: newCategory
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add category",
            error: error.message
        });
    }
});

// UPDATE CATEGORY
router.put("/category/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({
            name: name.trim(),
            _id: { $ne: id }
        });

        if (existingCategory) {
            return res.status(409).json({
                message: "Category name already exists"
            });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                description: description || ""
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category updated successfully",
            category: updatedCategory
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update category",
            error: error.message
        });
    }
});

// DELETE CATEGORY
router.delete("/category/:id", async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(
            req.params.id
        );

        if (!deletedCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete category",
            error: error.message
        });
    }
});

module.exports = router;
