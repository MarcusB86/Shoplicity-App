import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Fade,
  Zoom
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            letterSpacing: '1px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        >
          Shoplicity
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Fade in timeout={1000}>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'white',
                    fontWeight: 'medium'
                  }}
                >
                  {user.email}
                </Typography>
              </Fade>
              <StyledIconButton
                color="inherit"
                component={RouterLink}
                to="/cart"
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={0} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </StyledIconButton>
              <StyledButton
                color="inherit"
                component={RouterLink}
                to="/profile"
                sx={{ mr: 1 }}
              >
                Profile
              </StyledButton>
              <StyledButton
                color="inherit"
                onClick={logout}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                Logout
              </StyledButton>
            </>
          ) : (
            <>
              <StyledButton
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                Login
              </StyledButton>
              <StyledButton
                color="inherit"
                component={RouterLink}
                to="/signup"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                Sign Up
              </StyledButton>
            </>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar; 