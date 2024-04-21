const express = require('express');
const router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const localStrategy = require('passport-local');
const posts = require('./posts');

// Passport Local Strategy Configuration
passport.use(new localStrategy(userModel.authenticate()));

// GET Home Page
router.get('/', function(req, res, next) {
  res.render('index', { nav: true });
});

// DELETE User Route
router.delete('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const deletedUser = await userModel.findOneAndDelete({ username: username });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET Template Page
router.get('/template', isLoggedIn, function(req, res, next) {
  res.render('template2', { nav: true });
});

// GET Register Page
router.get('/register', function(req, res, next) {
  res.render('register', { error: req.flash('error'),nav: false })
});

// GET Resume Page
router.get('/resume', function(req, res, next) {
  res.render('resume1', { nav: true });
});

// GET Edit Page
// GET Edit Page
// GET Edit Page
router.get('/edit', isLoggedIn, async function(req, res, next) {
  try {
      const user = await userModel.findOne({ username: req.session.passport.user }).populate('posts');
      if (!user) {
          return res.status(404).send('User not found');
      }
      res.render('edit', { nav: false, user, skills: user.skills }); // Pass the user's skills to the template
  } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).send('Internal Server Error');
  }
});



// POST Edit Route
// POST Edit Route
// POST Edit Route
// POST Edit Route
router.post('/edit', isLoggedIn, async function(req, res, next) {
  try {
    // Get form data
    const formData = {
      firstName: req.body.firstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      phone: req.body.phone,
      country: req.body.country,
      city: req.body.city,
      summary: req.body.summary,
      education: req.body.education,
      skills: req.body.skills ? req.body.skills.filter(skill => skill.trim() !== '') : []
 // Split the skills string by newline and remove empty entries if req.body.skills exists, otherwise, assign an empty array
    };

    // Save the form data to the database
    const post = new postModel(formData);
    await post.save();

    // Render the template with the form data and skills
    res.render('template2', { formData, skills: formData.skills });

    


  } catch (error) {
    console.error('Error rendering template:', error);
    return res.status(500).send('Internal Server Error');
  }
});




// GET Preview Page
router.get('/preview', isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user }).populate('posts');
   const posts=await postModel.find()
   .populate('user')
    res.render('template2', {user,posts});
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// POST Register Route
router.post('/register', async function(req, res, next) {
  try {
    const data = new userModel({
      username: req.body.username,
      email: req.body.email,
      contact: req.body.contact,
      name: req.body.fullName
    });
    if (!data.username || !data.email || !req.body.password) {
      req.flash('error', 'Please fill out all required fields');
      return res.redirect('/register');
    }
    await userModel.register(data, req.body.password);
    passport.authenticate('local')(req, res, function() {
      res.redirect('/template');
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// GET Login Page
router.get('/login', function(req, res, next) {
  // console.log(req.flash('error'));
  res.render('login', { error: req.flash('error'),nav: false });//helping us To shwo the Error of wrong username and Password for login
  // res.render('login', { nav: true})
}); 

// POST Login Route
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/edit',
  failureFlash: true,
}));

// GET Logout Route
// router.get('/logout',function(req, res, next) {
//   req.logout();
//   res.redirect('/');
// });
// GET Logout Route
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});


// Middleware to check if the user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
