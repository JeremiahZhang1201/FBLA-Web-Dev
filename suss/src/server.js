// server.js
const path = require('path');
// Load .env from the parent folder
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = 6969;
console.log('MONGODB_URI =>', process.env.MONGODB_URI);
console.log('PORT =>', PORT);

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB with added connection options and logging
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, // Warning: these options are deprecated in driver 4.x but remain harmless
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Mongoose Schemas & Models

// Job schema
const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  description: String,
  location: String,
  coursesWanted: String,
  minGPA: String,
  intendedMajor: String,
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', jobSchema);

// Application schema
const applicationSchema = new mongoose.Schema({
  jobId: String,
  jobTitle: String,
  userId: String,
  userName: String,
  email: String,
  resume: String,
  appliedAt: Date,
});

const Application = mongoose.model('Application', applicationSchema);

// Routes

// GET all jobs
app.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new job (with added logging)
app.post('/jobs', async (req, res) => {
  console.log('Received job posting:', req.body);
  try {
    const {
      title,
      company,
      description,
      location,
      coursesWanted,
      minGPA,
      intendedMajor,
    } = req.body;

    const newJob = new Job({
      title,
      company,
      description,
      location,
      coursesWanted,
      minGPA,
      intendedMajor,
    });
    await newJob.save();
    console.log('Job saved successfully:', newJob);
    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve a job
app.put('/jobs/:id/approve', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a job
app.delete('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new application
app.post('/applications', async (req, res) => {
  try {
    const { jobId, jobTitle, userId, userName, email, resume, appliedAt } =
      req.body;
    const newApp = new Application({
      jobId,
      jobTitle,
      userId,
      userName,
      email,
      resume,
      appliedAt,
    });
    await newApp.save();
    res.status(201).json(newApp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET applications (optionally filtered by userId)
app.get('/applications', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const applications = await Application.find(filter).sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
