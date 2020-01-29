const Events = require('../models/Event');
const Slots = require('../models/Slot');

/**
 * GET /events/index
 * Home page.
 */

exports.showEventSlots = (req, res) => {
  const eventID = req.params.event_id ? req.params.event_id : req.body.event_id;

  Events.findById(eventID, (err, eventResult) => {
    Slots.find({ event: eventID }, (err, slotsResult) => {
      if (!eventResult) {
        console.log(`showEventSlots: can't find event ${eventID}`);
        res.status(404)
          .send('Event Not found');
        return;
      }
      res.render('event/slots', {
        title: `Event ${eventResult.title}`,
        event: eventResult,
        slots: slotsResult});
    });
  });
};

exports.createSlot = (req, res) => {
  const mySlot = new Slots({
    event: req.body.event_id,
    startsAt: req.body.startsat,
    notBefore: req.body.notbefore,
    notAfter: req.body.notafter,
    title: req.body.title
  });

  // validate the event id
  const eventID = req.params.id ? req.params.id : req.body.event_id;

  Events.findById(eventID, (err, eventResult) => {
    if (!eventResult) {
      console.log(`createSlot: can't find event ${eventID}`);
      res.status(404)
        .send('Event Not found');
      return;
    }

    mySlot.save()
      .then(() => {
        this.showEventSlots(req, res);
      })
      .catch(() => {
        // mild bug here, no other event can share the same time slot.
        // we really need a compound key or better search here.
        req.flash('errors', { msg: 'That time slot already exists.' });
        res.redirect(`/events/${eventID}/slots`);
      });
  });
};

exports.deleteSlot = (req, res) => {
  const eventID = req.params.id ? req.params.id : req.body.event_id;
  Slots.deleteOne({ _id: req.body._id })
    .then(() => {
      res.redirect(`/events/${eventID}/slots`);
    });
};