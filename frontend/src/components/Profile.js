import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Profile = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        title: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        condition: ''
    });

    const categories = [
        'Electronics',
        'Clothing',
        'Home & Garden',
        'Sports',
        'Books',
        'Toys',
        'Other'
    ];

    const conditions = [
        'New',
        'Like New',
        'Good',
        'Fair',
        'Poor'
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/user/me', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleOpen = () => {
        setEditingProduct(null);
        setNewProduct({
            title: '',
            description: '',
            price: '',
            imageUrl: '',
            category: '',
            condition: ''
        });
        setOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setNewProduct({
            title: product.title,
            description: product.description,
            price: product.price,
            imageUrl: product.image_url || '',
            category: product.category,
            condition: product.condition
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingProduct(null);
        setNewProduct({
            title: '',
            description: '',
            price: '',
            imageUrl: '',
            category: '',
            condition: ''
        });
    };

    const handleChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingProduct) {
                await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, newProduct, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await axios.post('http://localhost:5000/api/products', newProduct, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            handleClose();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error.response?.data || error.message);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">My Profile</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleOpen}
                    sx={{ 
                        '&:hover': {
                            backgroundColor: 'primary.dark'
                        }
                    }}
                >
                    Add New Product
                </Button>
            </Box>

            <Typography variant="h5" sx={{ mb: 2 }}>My Products</Typography>
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card>
                            {product.image_url && (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.image_url}
                                    alt={product.title}
                                />
                            )}
                            <CardContent>
                                <Typography gutterBottom variant="h6">
                                    {product.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                    ${product.price}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Category: {product.category}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Condition: {product.condition}
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(product)}
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(product.id)}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            margin="dense"
                            name="title"
                            label="Title"
                            fullWidth
                            required
                            value={newProduct.title}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="description"
                            label="Description"
                            fullWidth
                            required
                            multiline
                            rows={4}
                            value={newProduct.description}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="price"
                            label="Price"
                            type="number"
                            fullWidth
                            required
                            value={newProduct.price}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="imageUrl"
                            label="Image URL"
                            fullWidth
                            value={newProduct.imageUrl}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="category"
                            label="Category"
                            select
                            fullWidth
                            required
                            value={newProduct.category}
                            onChange={handleChange}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            margin="dense"
                            name="condition"
                            label="Condition"
                            select
                            fullWidth
                            required
                            value={newProduct.condition}
                            onChange={handleChange}
                        >
                            {conditions.map((condition) => (
                                <MenuItem key={condition} value={condition}>
                                    {condition}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        color="primary"
                        disabled={!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.category || !newProduct.condition}
                    >
                        {editingProduct ? 'Save Changes' : 'Add Product'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Profile; 