const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// Get cart items
router.get('/', auth, async (req, res) => {
    try {
        const cartItems = await Cart.getCart(req.user.id);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cartItem = await Cart.addItem(req.user.id, productId, quantity);
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
    try {
        const cartItem = await Cart.removeItem(req.user.id, req.params.productId);
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update item quantity
router.put('/update/:productId', auth, async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await Cart.updateQuantity(req.user.id, req.params.productId, quantity);
        res.json(cartItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
    try {
        const cartItems = await Cart.clearCart(req.user.id);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 