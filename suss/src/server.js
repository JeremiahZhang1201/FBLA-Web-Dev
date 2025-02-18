const path = require('path');
// 1) Load .env from the parent folder (../.env)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 2) Read environment variables
//    We will FORCE the server to run on 6969, ignoring .env if you'd like.
const MONGODB_URI = process.env.MONGODB_URI || '';
// If you want to allow .env to override it, do: const PORT = process.env.PORT || 6969;
// But let's always do 6969 as you requested:
const PORT = 6969;

// 3) Print them out (optional)
console.log('MONGODB_URI =>', MONGODB_URI);
console.log('PORT =>', PORT);

// 4) Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// 5) Connect to MongoDB (remove deprecated options)
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// 6) Define Mongoose Schemas & Models

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

// 7) Routes

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

// POST a new job
app.post('/jobs', async (req, res) => {
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
    res.status(201).json(newJob);
  } catch (error) {
    console.error(error);
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

// GET applications (optional userId filter)
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

// 8) Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
