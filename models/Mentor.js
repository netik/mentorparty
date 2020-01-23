const mongoose = require('mongoose');

/* An individual mentor */
const mentorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  company: String,
  photoURL: String,
  active: Boolean,
  user: { type: 'ObjectID', ref: 'User' } // mentors can be linked to users if need be
}, { timestamps: true });

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
