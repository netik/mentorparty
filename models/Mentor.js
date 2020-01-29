const mongoose = require('mongoose');
const EventMentor = require('./EventMentor');
const SlotUser = require('./SlotUser');

/* An individual mentor */
const mentorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  company: String,
  photoURL: String,
  active: Boolean,
  user: { type: 'ObjectID', ref: 'User' } // mentors can be linked to users if need be
}, { timestamps: true });

mentorSchema.pre('remove', (next) => {
  // 'this' is the client being removed. Provide callbacks here if you want
  // to be notified of the calls' result.
  EventMentor.remove({ mentorID: this._id }).exec();
  SlotUser.remove({ mentor: this._id }).exec();
  next();
});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
