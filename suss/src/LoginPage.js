// src/LoginPage.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Divider } from '@mui/material';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebaseAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box
        component="form"
        onSubmit={handleEmailPasswordLogin}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}
      >
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button variant="contained" type="submit">
          Login with Email
        </Button>
      </Box>
      <Divider sx={{ my: 2 }}>OR</Divider>
      <Button variant="outlined" onClick={handleGoogleLogin} fullWidth>
        Login with Google
      </Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don’t have an account? <Link to="/signup">Sign Up here</Link>.
      </Typography>
    </Container>
  );
}
