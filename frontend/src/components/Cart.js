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
    IconButton,
    TextField,
    Divider,
    Fade,
    Zoom,
    Grow,
    Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[8],
    },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'scale(1.1)',
    },
}));

const Cart = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCartItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axios.put(`http://localhost:5000/api/cart/update/${productId}`, 
                { quantity: newQuantity },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchCart();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            try {
                await axios.delete('http://localhost:5000/api/cart/clear', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                fetchCart();
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Fade in timeout={1000}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Shopping Cart
                    </Typography>
                    {cartItems.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleClearCart}
                            sx={{
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                }
                            }}
                        >
                            Clear Cart
                        </Button>
                    )}
                </Box>
            </Fade>

            {cartItems.length === 0 ? (
                <Fade in timeout={1000}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 4, 
                            textAlign: 'center',
                            background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
                        }}
                    >
                        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                            Your cart is empty
                        </Typography>
                    </Paper>
                </Fade>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {cartItems.map((item, index) => (
                            <Grid item xs={12} key={item.id}>
                                <Grow in timeout={1000} style={{ transformOrigin: '0 0 0' }} {...{ timeout: 1000 + index * 100 }}>
                                    <StyledCard>
                                        <CardContent>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} sm={3}>
                                                    {item.image_url && (
                                                        <CardMedia
                                                            component="img"
                                                            height="140"
                                                            image={item.image_url}
                                                            alt={item.title}
                                                            sx={{ 
                                                                objectFit: 'contain',
                                                                bgcolor: 'background.paper',
                                                                p: 1,
                                                                borderRadius: 1
                                                            }}
                                                        />
                                                    )}
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Typography 
                                                        variant="h6"
                                                        sx={{ fontWeight: 'bold' }}
                                                    >
                                                        {item.title}
                                                    </Typography>
                                                    <Typography 
                                                        variant="body2" 
                                                        color="text.secondary"
                                                        sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical'
                                                        }}
                                                    >
                                                        {item.description}
                                                    </Typography>
                                                    <Typography 
                                                        variant="h6" 
                                                        color="primary" 
                                                        sx={{ 
                                                            mt: 1,
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        ${item.price}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 1,
                                                        justifyContent: 'center'
                                                    }}>
                                                        <StyledIconButton
                                                            size="small"
                                                            onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                                            sx={{ 
                                                                bgcolor: 'background.paper',
                                                                boxShadow: 1
                                                            }}
                                                        >
                                                            <RemoveIcon />
                                                        </StyledIconButton>
                                                        <Typography 
                                                            sx={{ 
                                                                minWidth: '40px',
                                                                textAlign: 'center',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {item.quantity}
                                                        </Typography>
                                                        <StyledIconButton
                                                            size="small"
                                                            onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                                            sx={{ 
                                                                bgcolor: 'background.paper',
                                                                boxShadow: 1
                                                            }}
                                                        >
                                                            <AddIcon />
                                                        </StyledIconButton>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <StyledIconButton
                                                            color="error"
                                                            onClick={() => handleRemoveItem(item.product_id)}
                                                            sx={{ 
                                                                bgcolor: 'background.paper',
                                                                boxShadow: 1
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </StyledIconButton>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </StyledCard>
                                </Grow>
                            </Grid>
                        ))}
                    </Grid>

                    <Fade in timeout={1000}>
                        <Paper 
                            elevation={3}
                            sx={{ 
                                mt: 4, 
                                p: 3, 
                                bgcolor: 'background.paper', 
                                borderRadius: 2,
                                background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
                            }}
                        >
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    textAlign: 'right',
                                    fontWeight: 'bold',
                                    color: 'primary.main'
                                }}
                            >
                                Total: ${calculateTotal().toFixed(2)}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={handleCheckout}
                                    disabled={cartItems.length === 0}
                                    sx={{ 
                                        py: 1.5,
                                        px: 4,
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        }
                                    }}
                                >
                                    Proceed to Checkout
                                </Button>
                            </Box>
                        </Paper>
                    </Fade>
                </>
            )}
        </Container>
    );
};

export default Cart; 