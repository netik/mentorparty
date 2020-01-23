const Events = require('../models/Event');
/**
 * GET /events/index
 * Home page.
 */

exports.showEvents = (req, res) => {
  Events.find((err, result) => {
    res.render('event/index', { title: 'Events', events: result });
  });
};

exports.createEvent = (req, res) => {
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
