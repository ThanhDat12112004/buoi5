var express = require('express');
var router = express.Router();
var productSchema = require('../schema/product');

router.get('/', async function(req, res, next) {
    try {
        let products = await productSchema.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async function(req, res, next) {
    try {
        const productId = req.params.id;
        const product = await productSchema.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', async function(req, res, next) {
    try {
        let body = req.body;
        if (!body.name || !body.category) {
            return res.status(400).json({ success: false, message: 'Name and category are required' });
        }
        let newProduct = new productSchema({
            name: body.name,
            price: body.price !== undefined ? body.price : 100,
            quantity: body.quantity !== undefined ? body.quantity : 1,
            category: body.category,
            description: body.description || '',
            imageURL: body.imageURL || ''
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/:id', async function(req, res, next) {
    try {
        let body = req.body;
        let updatedObj = {};

        if (body.name !== undefined && body.name !== null) updatedObj.name = body.name;
        if (body.quantity !== undefined && body.quantity !== null) updatedObj.quantity = body.quantity;
        if (body.price !== undefined && body.price !== null) updatedObj.price = body.price;
        if (body.category !== undefined && body.category !== null) updatedObj.category = body.category;
        if (body.description !== undefined && body.description !== null) updatedObj.description = body.description;
        if (body.imageURL !== undefined && body.imageURL !== null) updatedObj.imageURL = body.imageURL;

        let updatedProduct = await productSchema.findByIdAndUpdate(
            req.params.id,
            updatedObj, { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
        const productId = req.params.id;
        const deletedProduct = await productSchema.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;