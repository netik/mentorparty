const mongoose = require('mongoose');

const slotUserSchema = new mongoose.Schema({
  event: { type: 'ObjectId', ref: 'Event' },
  mentor: { type: 'ObjectId', ref: 'Mentor' },
  slot: { type: 'ObjectID', ref: 'Slot' },
  user: { type: 'ObjectId', ref: 'User' },
  takenBy: { type: 'String' }, // todo, should we reference a user here?
}, { timestamps: true });

const SlotUser = mongoose.model('SlotUser', slotUserSchema);

module.exports = SlotUser;
