// src/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: { type: String, default: 'student' }, // "student" or "employer"
  gpa: { type: String, default: '' },
  courses: [{ type: String }],
  preferredRoles: [{ type: String }],
});

module.exports = mongoose.model('User', userSchema);
