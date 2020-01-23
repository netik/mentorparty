const mongoose = require('mongoose');

/* The table of events */
const eventSchema = new mongoose.Schema({
  startsAt: Date,
  title: String,
  location: String,
  shortCode: String
}, { timestamps: true });

const Events = mongoose.model('Events', eventSchema);

module.exports = Events;
