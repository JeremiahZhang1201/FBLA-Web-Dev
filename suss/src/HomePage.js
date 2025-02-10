import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome to Guidance Dept
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Typography variant="h6" color="text.secondary" paragraph sx={{ fontWeight: 400 }}>
          Discover top job opportunities and modern career solutions. Submit postings, view jobs, and apply effortlessly.
        </Typography>
      </motion.div>
      <motion.div
        style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Button variant="contained" component={Link} to="/submit" sx={{ textTransform: 'none', py: 1.5, px: 3 }}>
          Submit a Posting
        </Button>
        <Button variant="outlined" component={Link} to="/jobs" sx={{ textTransform: 'none', py: 1.5, px: 3 }}>
          View Jobs
        </Button>
      </motion.div>
    </Container>
  );
}
