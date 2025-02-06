import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuth0 } from '@auth0/auth0-react';

export default function NavigationBar() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', gap: 3 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: 'inherit', textDecoration: 'none' }}
        >
          Guidance Dept
        </Typography>
        <Button component={Link} to="/submit" sx={{ color: 'white' }}>
          Submit
        </Button>
        <Button component={Link} to="/jobs" sx={{ color: 'white' }}>
          Jobs
        </Button>
        {isAuthenticated && (
          <Button component={Link} to="/my-applications" sx={{ color: 'white' }}>
            My Applications
          </Button>
        )}
        {isAuthenticated ? (
          <Button
            sx={{ color: 'white' }}
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Logout
          </Button>
        ) : (
          <Button sx={{ color: 'white' }} onClick={() => loginWithRedirect()}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
