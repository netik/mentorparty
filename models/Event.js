const mongoose = require('mongoose');
const EventMentor = require('./EventMentor');
const SlotUser = require('./SlotUser');
const Slot = require('./Slot');

/* The table of events */
const eventSchema = new mongoose.Schema({
  startsAt: Date,
  title: String,
  location: String,
  shortCode: String
}, { timestamps: true });

eventSchema.pre('remove', (next) => {
  // This will only fire on an instance of the model being deleted
  // (But does not fire on a mass-delete)
  //
  // 'this' is the client being removed. Provide callbacks here if you want
  // to be notified of the calls' result.
  console.log('remove was called');
  EventMentor.remove({ eventID: this._id }).exec();
  Slot.remove({ event: this._id }).exec();
  SlotUser.remove({ event: this._id }).exec();
  next();
});

const Events = mongoose.model('Events', eventSchema);

module.exports = Events;
