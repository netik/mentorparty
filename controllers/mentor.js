const validator = require('validator');
const Mentors = require('../models/Mentor');
const Events = require('../models/Event');
const EventMentors = require('../models/EventMentor');
const SlotUsers = require('../models/SlotUser');

/**
 * GET /events/index
 * Home page.
 */

exports.showMentors = (req, res) => {
  Mentors.find((err, result) => {
    res.render('mentor/index', { title: 'Mentors', mentors: result });
  });
};

exports.createMentor = (req, res) => {
  const validationErrors = [];
  if (!req.body.name || validator.isEmpty(req.body.name)) validationErrors.push({ msg: 'Name cannot be blank.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/mentors');
  }

  const myMentor = new Mentors ({
    name: req.body.name,
    bio: req.body.bio,
    company: req.body.company,
    photoURL: req.body.photourl,
    active: true
  });

  myMentor.save()
    .then(() => {
      Mentors.find((err, result) => {
        req.flash('success', { msg: 'Mentor created.' });
        res.render('mentor/index', { title: 'Mentors', mentors: result });
      });
    });
};

exports.deleteMentor = (req, res) => {
  Mentors.deleteOne({ _id: req.body._id })
    .then(() => {
      EventMentors.remove({ mentorID: req.body._id }).exec();
      SlotUsers.remove({ mentor: req.body._id }).exec();

      Mentors.find((err, result) => {
        req.flash('success', { msg: 'Mentor removed.' });
        res.render('mentor/index', { title: 'Mentors', mentors: result });
      });
    });
};

exports.showEventMentors = async (req, res) => {
  const eventID = req.params.event_id ? req.params.event_id : req.body.event_id;
  const eventResult = await Events.findById(eventID);

  if (!eventResult) {
    console.log(`showEventSlots: can't find event ${eventID}`);
    res.status(404)
      .send('Event Not found');
    return;
  }
  const allMentors = await Mentors.find();
  const eventMentors = await EventMentors.find({ eventID });

  res.render('event/mentors', {
    title: `Event Mentors - ${eventResult.title}`,
    event: eventResult,
    mentors: allMentors,
    eventMentors,
    isMentorChecked: (mentorID) => { // we have a helper function here to search the array.
      for (let i = 0; i < eventMentors.length; i++) {
        if (String(eventMentors[i].mentorID) === String(mentorID)) {
          return true;
        }
      }
      return false;
    }
  });
};

exports.replaceMentors = async (req,res) => {
  const eventID = req.params.event_id ? req.params.event_id : req.body.event_id;
  const eventResult = await Events.findById(eventID);

  if (!eventResult) {
    console.log(`showEventSlots: can't find event ${eventID}`);
    res.status(404)
      .send('Event Not found');
    return;
  }

  // first delete all of the mentors for this event
  EventMentors.deleteMany({ eventID })
    .then(() => {
      // now, for each key in the document, if it's a mentor key, turn it on.
      Object.keys(req.body).forEach((key) => {
        if (key.startsWith('mentor-') && req.body[key] === 'on') {
          const mentorID = key.replace('mentor-', '');

          // TODO: confirm that mentor actually exists or enforce DB
          // restrictions here
          const myEM = new EventMentors({
            eventID,
            mentorID
          });
          myEM.save((err) => {
            req.flash('error', { msg: `error during save - ${err}` });
          });
        }
      });
    });
  // then redirect back to the event page
  req.flash('info', { msg: 'Mentors for this event have been updated.' });
  res.redirect(`/events/${eventID}/mentors`);
};
