import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    TextField,
    MenuItem,
    Box,
    Button,
    Snackbar,
    Alert,
    Fade,
    Zoom,
    Grow,
    Paper
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../utils/api';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
}));

const StyledCardMedia = styled(CardMedia)({
    height: 200,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundColor: '#f5f5f5',
    padding: '16px',
});

const StyledCardContent = styled(CardContent)({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
});

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const ProductList = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
            setLoading(true);
            console.log('Fetching products...');
            const response = await api.get('/api/products');
            console.log('Products response:', response.data);
            setProducts(response.data);
            setFilteredProducts(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
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

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            setError(error.response?.data?.message || 'Failed to delete product');
        }
    };

    const handleAddToCart = async (productId) => {
        if (!user) {
            setSnackbar({
                open: true,
                message: 'Please log in to add items to cart',
                severity: 'error'
            });
            return;
        }

        try {
            await api.post('/api/cart/add', { productId, quantity: 1 });
            setSnackbar({
                open: true,
                message: 'Item added to cart',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            setError(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Fade in timeout={1000}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Products
                    </Typography>
                    {user && (
                        <StyledButton
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/add-product')}
                        >
                            Add Product
                        </StyledButton>
                    )}
                </Box>
            </Fade>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <Typography>Loading products...</Typography>
                </Box>
            )}

            {error && (
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                </Snackbar>
            )}

            {!loading && products.length === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <Typography>No products found</Typography>
                </Box>
            )}

            <Grid container spacing={3}>
                {filteredProducts.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <Grow in timeout={1000} style={{ transformOrigin: '0 0 0' }} {...{ timeout: 1000 + index * 100 }}>
                            <StyledCard>
                                <StyledCardMedia
                                    image={product.image_url}
                                    title={product.title}
                                />
                                <StyledCardContent>
                                    <Box>
                                        <Typography gutterBottom variant="h6" component="h2" noWrap>
                                            {product.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {product.description}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                                            ${product.price}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Category: {product.category}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Condition: {product.condition}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {user && user.id === product.seller_id ? (
                                            <>
                                                <StyledButton
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => navigate(`/edit-product/${product.id}`)}
                                                >
                                                    Edit
                                                </StyledButton>
                                                <StyledButton
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    Delete
                                                </StyledButton>
                                            </>
                                        ) : (
                                            <StyledButton
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<ShoppingCartIcon />}
                                                onClick={() => handleAddToCart(product.id)}
                                                fullWidth
                                            >
                                                Add to Cart
                                            </StyledButton>
                                        )}
                                    </Box>
                                </StyledCardContent>
                            </StyledCard>
                        </Grow>
                    </Grid>
                ))}
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={Zoom}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ 
                        width: '100%',
                        boxShadow: 3
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductList; 