const validator = require('validator');
const Events = require('../models/Event');
const EventMentors = require('../models/EventMentor');
const Slots = require('../models/Slot');
const SlotUser = require('../models/SlotUser');

/**
 * GET /events/index
 * Home page.
 */

exports.showEvents = (req, res) => {
  Events.find((err, result) => {
    res.render('event/index', { title: 'Events', events: result });
  });
};

exports.jumpToEvent = (req, res) => {
  const shortcode = req.params.shortcode ? req.params.shortcode : req.body.code;
  Events.findOne({ shortCode: shortcode })
    .then((event) => {
      if (!event) {
        req.flash('errors', { msg: 'Event not found' });
        res.redirect('/');
        return;
      }

      res.redirect(`/events/${event._id}/show`);
    });
};

exports.showEvent = async (req, res) => {
  const eventID = req.params.event_id;

  Events.findById(eventID)
    .then((event) => {
      // Now that we've verified the events, if you don't have a name set,
      // then let's get that first. we'll return you here when you're done.
      if (!req.session.name && !req.user) {
        req.session.returnTo = `/events/${event.id}/show`;
        res.render('getname', { title: 'new party, who dis?' });
        return;
      }
      SlotUser.find({ event: event._id })
        .populate('user')
        .then((slotusers) => {
          Slots.find({ event: event._id })
            .then((slots) => {
              EventMentors.find({ eventID: event._id })
                .populate('mentorID')
                .then((eventmentors) => {
                  res.render('event/show', {
                    title: `Event - ${event.title}`,
                    event,
                    eventmentors,
                    slots,
                    slotusers,
                    // we have a helper function here to search the array.
                    isSlotTaken: (slotID, mentorID) => {
                      for (let i = 0; i < slotusers.length; i++) {
                        if ((String(slotusers[i].mentor) === String(mentorID))
                            && (String(slotusers[i].slot) === String(slotID))) {
                          return true;
                        }
                      }
                      return false;
                    },
                    slotTakenBy: (slotID, mentorID) => {
                      for (let i = 0; i < slotusers.length; i++) {
                        if ((String(slotusers[i].mentor) === String(mentorID))
                            && (String(slotusers[i].slot) === String(slotID))) {
                          return slotusers[i].takenBy;
                        }
                      }
                      return false;
                    },
                    isPastDate: (d) => {
                      if (!d) {
                        // if d is unset we don't care.
                        return false;
                      }
                      return Date.now() >= d;
                    }
                  });
                });
            });
        });
    })
    .catch((err) => {
      console.log(err);
      req.flash('errors', { msg: 'Event not found' });
      res.render('event/show', { title: 'Event not found' });
    });
};

exports.createEvent = (req, res) => {
  const validationErrors = [];
  if (!req.body.title || validator.isEmpty(req.body.title)) validationErrors.push({ msg: 'Title cannot be blank.' });
  if (!req.body.shortcode || validator.isEmpty(req.body.shortcode)) validationErrors.push({ msg: 'Short code cannot be blank.' });
  if (!req.body.startsat || validator.isEmpty(req.body.startsat)) validationErrors.push({ msg: 'Starts at time cannot be blank.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/events');
  }

  const myEvent = new Events({
    title: req.body.title,
    location: req.body.location,
    shortCode: req.body.shortcode,
    startsAt: req.body.startsat
  });

  myEvent.save()
    .then(() => {
      Events.find((err, result) => {
        res.render('event/index', { title: 'Events', events: result });
      });
    });
};

exports.deleteEvent = (req, res) => {
  Events.deleteOne({ _id: req.body._id })
    .then(() => {
      EventMentors.remove({ eventID: req.body._id }).exec();
      Slots.remove({ event: req.body._id }).exec();
      SlotUser.remove({ event: req.body._id }).exec();

      Events.find((err, result) => {
        res.render('event/index', { title: 'Events', events: result });
      });
    });
};

exports.takeEventSlot = (req, res) => {
  // does the slot exist?
  // does the mentor exist
  const mySlot = new SlotUser({
    event: req.body.event_id,
    mentor: req.body.mentor_id,
    slot: req.body.slot_id,
    user: req.user ? req.user._id : undefined,
    takenBy: req.session.name || req.user.profile.name || req.user.email
  });

  mySlot.save()
    .then(() => {
      req.flash('success', { msg: 'Signed up!' });
      res.redirect(`/events/${req.body.event_id}/show`);
    });
};

exports.releaseEventSlot = (req, res) => {
  // does the slot exist?
  // does the mentor exist

  SlotUser.deleteOne({ slot: req.body.slot_id, mentor: req.body.mentor_id })
    .then(() => {
      req.flash('success', { msg: 'Slot Released.' });
      res.redirect(`/events/${req.body.event_id}/show`);
    });
};
