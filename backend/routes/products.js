const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new product
router.post('/', auth, async (req, res) => {
    try {
        console.log('User:', req.user); // Debug log
        console.log('Request body:', req.body); // Debug log
        
        const product = await Product.create({
            userId: req.user.id,
            ...req.body
        });
        console.log('Created product:', product); // Debug log
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error); // Debug log
        res.status(400).json({ message: error.message });
    }
});

// Update a product
router.put('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.seller_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const updatedProduct = await Product.update(req.params.id, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a product
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.seller_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await Product.delete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's products
router.get('/user/me', auth, async (req, res) => {
    try {
        const products = await Product.findByUserId(req.user.id);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 