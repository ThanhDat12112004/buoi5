var express = require('express');
var router = express.Router();
var categorySchema = require('../schema/category');

router.get('/', async function(req, res, next) {
    try {
        let categories = await categorySchema.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async function(req, res, next) {
    try {
        const categoryId = req.params.id;
        const category = await categorySchema.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', async function(req, res, next) {
    try {
        let body = req.body;
        if (!body.name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        const newCategory = new categorySchema({
            name: body.name,
            description: body.description || ''
        });
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/:id', async function(req, res, next) {
    try {
        const categoryId = req.params.id;
        let body = req.body;
        let updatedObj = {};

        if (body.name !== undefined && body.name !== null) {
            updatedObj.name = body.name;
        }
        if (body.description !== undefined && body.description !== null) {
            updatedObj.description = body.description;
        }


        const updatedCategory = await categorySchema.findByIdAndUpdate(
            categoryId,
            updatedObj, { new: true, runValidators: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await categorySchema.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, message: 'Category deleted', category: deletedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;