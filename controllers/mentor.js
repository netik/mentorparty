const Mentors = require('../models/Mentor');
const Events = require('../models/Event');
const EventMentors = require('../models/EventMentor');

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
  console.log(req.body.active);

  const myMentor = new Mentors ({
    name: req.body.name,
    bio: req.body.bio,
    company: req.body.company,
    photoURL: req.body.photourl,
    active: req.body.active === 'on'
  });

  myMentor.save()
    .then(() => {
      Mentors.find((err, result) => {
        res.render('mentor/index', { title: 'Mentors', mentors: result });
      });
    });
};

exports.deleteMentor = (req, res) => {
  Mentors.deleteOne({ _id: req.body._id })
  .then(() => {
    Mentors.find((err, result) => {
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
  const eventMentors = await EventMentors.find({ event: eventID });

  res.render('event/mentors', {
    title: `Event Mentors - ${eventResult.title}`,
    event: eventResult,
    mentors: allMentors,
    eventMentors
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
  EventMentors.deleteMany({ event_id: eventID })
    .then(() => {
      // now, for each key in the document, if it's a mentor key, turn it on.
      Object.keys(req.body).forEach((key) => {
        console.log(key, req.body[key]);

        if (key.startsWith('mentor-') && req.body[key] === 'on') {
          const mentorID = key.replace('mentor-', '');

          console.log("save " + key + " - " + eventID + " - " + mentorID);

          const myEM = new EventMentors({
            eventID,
            mentorID
          });

          myEM.save();
        }
      });
    });
  // then redirect back to the event page
  res.redirect(`/events/${eventID}/mentors`);
};
