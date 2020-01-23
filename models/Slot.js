const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  startsAt: { type: Date, unique: true, required: true, dropDups: true },
  notBefore: { type: Date, required: true }, // you can't sign up before this time
  notAfter: Date, // can't sign up after this time
  title: String,
  event: { type: 'ObjectId', ref: 'Event' }
}, { timestamps: true });

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;
