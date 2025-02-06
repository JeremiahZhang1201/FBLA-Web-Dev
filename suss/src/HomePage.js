import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the Guidance Department Portal
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Typography variant="h6" color="text.secondary" paragraph>
          Bridge your future with top job opportunities. Submit postings, view jobs, and apply easily.
        </Typography>
      </motion.div>

      <motion.div
        style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button variant="contained" component={Link} to="/submit">
          Submit a Posting
        </Button>
        <Button variant="outlined" component={Link} to="/jobs">
          View Jobs
        </Button>
      </motion.div>
    </Container>
  );
}
