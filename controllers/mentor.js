const Mentors = require('../models/Mentor');
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
}
