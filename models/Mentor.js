const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  company: String,
  photoURL: String,
  active: Boolean,
}, { timestamps: true });

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
