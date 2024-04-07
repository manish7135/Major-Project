const express = require('express');
const router = express.Router();
const userModel = require('./users');
const formModel = require('./posts');
const passport = require('passport');
const localStrategy = require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index', { nav: true });
});

router.get('/template', isLoggedIn, function(req, res, next) {
  res.render('template', { nav: true });
});

router.get('/register', function(req, res, next) {
  res.render('register', { nav: false });
});

router.get('/resume', function(req, res, next) {
  res.render('resume1', { nav: true });
});

router.get('/edit', function(req, res, next) {
  res.render('edit', { nav: false });
});

router.post('/edit', async function(req, res, next) {
  try {
    // Fetch user data
    const user = await userModel.findOne({ username: req.session.passport.user });
    
    if (!user) {
      // Handle case where user is not found
      return res.status(404).send('User not found');
    }

    // Create a new post instance with the provided data
    const newPost = new formModel({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      experience: [{
        expName1: req.body.expName1,
        expLocation1: req.body.expLocation1,
        expDuration1: req.body.expDuration1,
        expPosition1: req.body.expPosition1,
        expDescription1: req.body.expDescription1,
      }],
      skill: [{
        skillName1: req.body.skillName1,
        skillLevel1: req.body.skillLevel1,
      }],
      projects: [{
        projectName1: req.body.projectName1,
        projectDescription1: req.body.projectDescription1,
      }],
    });

    // Save the new post
    await newPost.save();

    // Check if user.posts is an array before pushing
    if (!Array.isArray(user.posts)) {
      user.posts = [];
    }
    
    // Push the post to the user's posts array
    user.posts.push(newPost._id);

    // Save the user
    await user.save();

    // Redirect to preview page
    return res.redirect('/preview');
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  }
});




router.get('/preview', function(req, res, next) {
  res.render("resume1");
});

router.post('/register', function(req, res, next) {
  const data = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
    name: req.body.fullName
  });
  userModel.register(data, req.body.password)
    .then(function() {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/template');
      });
    });
});

router.get('/login', function(req, res, next) {
  res.render('login', { nav: false });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
  successRedirect: '/template',
}), function(req, res, next) {
  res.render('/');
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
