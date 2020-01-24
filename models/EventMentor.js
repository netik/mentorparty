const mongoose = require('mongoose');

/* this table links mentors to events */
const eventMentorSchema = new mongoose.Schema({
  eventID: { type: 'ObjectId', ref: 'Event' },
  mentorID: { type: 'ObjectId', ref: 'Mentor' },
}, { timestamps: true });

const EventMentor = mongoose.model('EventMentor', eventMentorSchema);

module.exports = EventMentor;
