import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Box,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Alert,
    Snackbar
} from '@mui/material';

const steps = ['Shipping address', 'Payment details', 'Review order'];

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [shippingData, setShippingData] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    const [paymentData, setPaymentData] = useState({
        cardName: '',
        cardNumber: '',
        expDate: '',
        cvv: ''
    });

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setActiveStep(1);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setActiveStep(2);
    };

    const handlePlaceOrder = async () => {
        try {
            // In a real application, you would send this to your payment processor
            // and create an order in your database
            await axios.post('http://localhost:5000/api/orders', {
                shipping: shippingData,
                payment: paymentData
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Clear the cart after successful order
            await axios.delete('http://localhost:5000/api/cart/clear', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSnackbar({
                open: true,
                message: 'Order placed successfully!',
                severity: 'success'
            });

            // Redirect to order confirmation page
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        } catch (error) {
            console.error('Error placing order:', error);
            setSnackbar({
                open: true,
                message: 'Error placing order. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <form onSubmit={handleShippingSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="First name"
                                    value={shippingData.firstName}
                                    onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Last name"
                                    value={shippingData.lastName}
                                    onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Address line 1"
                                    value={shippingData.address1}
                                    onChange={(e) => setShippingData({ ...shippingData, address1: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address line 2"
                                    value={shippingData.address2}
                                    onChange={(e) => setShippingData({ ...shippingData, address2: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="City"
                                    value={shippingData.city}
                                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="State/Province/Region"
                                    value={shippingData.state}
                                    onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Zip / Postal code"
                                    value={shippingData.zipCode}
                                    onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Country"
                                    value={shippingData.country}
                                    onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Next
                            </Button>
                        </Box>
                    </form>
                );
            case 1:
                return (
                    <form onSubmit={handlePaymentSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Name on card"
                                    value={paymentData.cardName}
                                    onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Card number"
                                    value={paymentData.cardNumber}
                                    onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Expiry date"
                                    placeholder="MM/YY"
                                    value={paymentData.expDate}
                                    onChange={(e) => setPaymentData({ ...paymentData, expDate: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="CVV"
                                    value={paymentData.cvv}
                                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Next
                            </Button>
                        </Box>
                    </form>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Order summary
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">
                                    Shipping Address:
                                </Typography>
                                <Typography>
                                    {shippingData.firstName} {shippingData.lastName}
                                </Typography>
                                <Typography>
                                    {shippingData.address1}
                                </Typography>
                                {shippingData.address2 && (
                                    <Typography>
                                        {shippingData.address2}
                                    </Typography>
                                )}
                                <Typography>
                                    {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                                </Typography>
                                <Typography>
                                    {shippingData.country}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">
                                    Payment details:
                                </Typography>
                                <Typography>
                                    Card holder: {paymentData.cardName}
                                </Typography>
                                <Typography>
                                    Card number: **** **** **** {paymentData.cardNumber.slice(-4)}
                                </Typography>
                                <Typography>
                                    Expiry date: {paymentData.expDate}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePlaceOrder}
                            >
                                Place order
                            </Button>
                        </Box>
                    </Box>
                );
            default:
                throw new Error('Unknown step');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Checkout
                </Typography>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {getStepContent(activeStep)}
            </Paper>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Checkout; 