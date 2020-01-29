const validator = require('validator');
const Events = require('../models/Event');
const EventMentors = require('../models/EventMentor');
const Slots = require('../models/Slot');
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
      Slots.find({ event: event._id })
        .then((slots) => {
          EventMentors.find({ eventID: event._id })
            .populate('mentorID')
            .then((eventmentors) => {
              res.render('event/show', {
                title: `Event - ${event.title}`,
                event,
                eventmentors,
                slots
              });
            });
        });
    })
    .catch(() => {
      req.flash('errors', { msg: 'Event not found' });
      res.render('event/show', { title: `Event not found` });
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
      Events.find((err, result) => {
        res.render('event/index', { title: 'Events', events: result });
      });
    });
};

// TODO:

// add a name to a slot

// display an event with slots -- want realtime updating here
