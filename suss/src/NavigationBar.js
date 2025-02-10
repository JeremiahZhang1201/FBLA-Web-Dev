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
    <AppBar
      position="static"
      sx={{ backgroundColor: '#fff', color: '#000', borderBottom: '1px solid #eaeaea' }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: '#000', textDecoration: 'none', fontWeight: 600 }}
        >
          Guidance Dept
        </Typography>
        <div>
          <Button component={Link} to="/submit" sx={{ color: '#000', mr: 2 }}>
            Submit
          </Button>
          <Button component={Link} to="/jobs" sx={{ color: '#000', mr: 2 }}>
            Jobs
          </Button>
          {isAuthenticated && (
            <Button component={Link} to="/my-applications" sx={{ color: '#000', mr: 2 }}>
              My Applications
            </Button>
          )}
          {isAuthenticated ? (
            <Button sx={{ color: '#000' }} onClick={() => logout({ returnTo: window.location.origin })}>
              Logout
            </Button>
          ) : (
            <Button sx={{ color: '#000' }} onClick={() => loginWithRedirect()}>
              Login
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
