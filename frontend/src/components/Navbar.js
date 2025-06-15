import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Shoplicity
        </Typography>

        <Box>
          {user ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/profile"
                sx={{ mr: 2 }}
              >
                Profile
              </Button>
              <Button
                color="inherit"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ mr: 2 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/signup"
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 