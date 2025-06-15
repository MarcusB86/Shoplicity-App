import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    MenuItem,
    Box
} from '@mui/material';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    const categories = [
        'All',
        'Electronics',
        'Clothing',
        'Home & Garden',
        'Sports',
        'Books',
        'Toys',
        'Other'
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, category, products]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const filterProducts = () => {
        let filtered = products;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (category && category !== 'All') {
            filtered = filtered.filter(product => product.category === category);
        }

        setFilteredProducts(filtered);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>All Products</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Search Products"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            select
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={3}>
                {filteredProducts.map((product) => (
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
                                <Typography variant="body2" color="text.secondary">
                                    Seller: {product.seller_email}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ProductList; 