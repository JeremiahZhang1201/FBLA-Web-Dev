// src/SignupPage.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebaseAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('student'); // "student" or "employer"
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gpa, setGpa] = useState('');
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState('');
  const [preferredRoles, setPreferredRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddCourse = () => {
    if (newCourse.trim()) {
      setCourses((prev) => [...prev, newCourse.trim()]);
      setNewCourse('');
    }
  };
  const handleRemoveCourse = (index) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddRole = () => {
    if (newRole.trim()) {
      setPreferredRoles((prev) => [...prev, newRole.trim()]);
      setNewRole('');
    }
  };
  const handleRemoveRole = (index) => {
    setPreferredRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1) Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      // 2) Build userData for Mongo
      const userData = {
        firebaseUid: userCredential.user.uid,
        email: userCredential.user.email,
        role, // "student" or "employer"
      };
      if (role === 'student') {
        userData.gpa = gpa;
        userData.courses = courses;
        userData.preferredRoles = preferredRoles;
      }

      // 3) POST /users
      const res = await fetch('http://localhost:6969/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('POST /users failed:', text);
        throw new Error(`Failed to save user doc in Mongo: ${text}`);
      }

      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please login or use a different email.');
      } else {
        setError(err.message);
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // If user picks role=employer, store that. If student, store that.
      const userData = {
        firebaseUid: result.user.uid,
        email: result.user.email,
        role,
      };
      if (role === 'student') {
        userData.gpa = gpa;
        userData.courses = courses;
        userData.preferredRoles = preferredRoles;
      }

      const res = await fetch('http://localhost:6969/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error('POST /users failed (Google signup):', text);
        throw new Error(`Failed to save user doc in Mongo: ${text}`);
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Sign Up
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Box component="form" onSubmit={handleSignup} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <TextField
          label="Display Name"
          variant="outlined"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">I am a</FormLabel>
          <RadioGroup row value={role} onChange={(e) => setRole(e.target.value)}>
            <FormControlLabel value="student" control={<Radio />} label="Student" />
            <FormControlLabel value="employer" control={<Radio />} label="Employer" />
          </RadioGroup>
        </FormControl>

        {role === 'student' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="GPA"
              variant="outlined"
              type="text"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
            />
            {/* Courses array */}
            <Box>
              <Typography variant="subtitle1">Courses Taken</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <TextField
                  label="Add a course"
                  variant="outlined"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <IconButton color="primary" onClick={handleAddCourse}>
                  <AddCircleOutline />
                </IconButton>
              </Box>
              <Box sx={{ mt: 1 }}>
                {courses.map((c, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography>{c}</Typography>
                    <IconButton size="small" color="error" onClick={() => handleRemoveCourse(index)}>
                      <RemoveCircleOutline />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
            {/* Preferred Roles array */}
            <Box>
              <Typography variant="subtitle1">Preferred Roles</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <TextField
                  label="Add a role"
                  variant="outlined"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <IconButton color="primary" onClick={handleAddRole}>
                  <AddCircleOutline />
                </IconButton>
              </Box>
              <Box sx={{ mt: 1 }}>
                {preferredRoles.map((r, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography>{r}</Typography>
                    <IconButton size="small" color="error" onClick={() => handleRemoveRole(index)}>
                      <RemoveCircleOutline />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

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
          Sign Up with Email
        </Button>
      </Box>

      <Divider sx={{ my: 2 }}>OR</Divider>
      <Button variant="outlined" onClick={handleGoogleSignup} fullWidth>
        Sign Up with Google
      </Button>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account? <Link to="/login">Login here</Link>.
      </Typography>
    </Container>
  );
}
