// src/HomePage.js
import React from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FeatureCarousel from './FeatureCarousel'; // optional
import image1 from './image1.jpeg'; // optional

export default function HomePage() {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          minHeight: '80vh',
          backgroundColor: '#fff',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          px: 2,
          py: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome to Mavex
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Typography variant="h6" paragraph sx={{ fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
            Connecting South Brunswick High School students with career opportunities.
            Easily search job postings or submit them, all in one place.
          </Typography>
        </motion.div>
        <motion.div
          style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
            sx={{ textTransform: 'none', py: 1.5, px: 3 }}
          >
            Sign Up / Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/jobs"
            sx={{ textTransform: 'none', py: 1.5, px: 3 }}
          >
            View Jobs
          </Button>
        </motion.div>
      </Box>

      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                Empowering Your Future
              </Typography>
              <Typography variant="body1" color="text.secondary">
                At South Brunswick High School, our guidance department is dedicated to helping
                you discover the right career path. Whether you’re a student searching for the
                perfect opportunity or an employer looking to share openings, our platform makes
                success attainable.
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Box
                component="img"
                src={image1}
                alt="Career Guidance"
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* If you have a feature carousel */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 600, mb: 4 }}>
          Explore Our Features
        </Typography>
        {FeatureCarousel && <FeatureCarousel />}
      </Container>
    </Box>
  );
}
