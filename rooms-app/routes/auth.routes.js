const router = require('express').Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const {isLoggedOut, isLoggedIn} = require('../middleware/route-guard')

//SIGNUP

router.get('/signup', isLoggedOut, (req, res) => {
  res.render('auth/signup');
});

router.get('/profile', isLoggedIn, (req, res) => {
  const { fullName } = req.session.currentUser;
  res.render('auth/profile', { fullName });
});

router.post('/signup', isLoggedOut, (req, res) => {
  const { email, password, fullName, slackID, googleID } = req.body;

  //server-side validation
  if (!email || !password || !fullName) {
    res.render('auth/signup', { errorMessage: 'Please provide at least your email, full name and password.'});
    return;
  }

  bcryptjs
  .genSalt(saltRounds)
  .then((salt) => bcryptjs.hash(password, salt))
  .then((hashedPassword) => {
    //console.log(`Password hash: ${hashedPassword}`);
    return User.create({
        email,
        password: hashedPassword,
        fullName,
        slackID,
        googleID
    });
  })
  .then((user) => {
    //console.log('Newly created user is: ', userFromDB);
    req.session.user = user;
    //res.render('auth/profile', {user})
    res.redirect('/auth/profile');
    //res.redirect('/auth/login');
  })
  .catch((error) => console.log(error));
});




//LOGIN

router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isLoggedOut, (req, res) => {
    console.log('SESSION =====> ', req.session);
    const { email, password } = req.body;
  
    if (!email || !password ) {
      res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
      return;
    }
  
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          res.render('auth/login', {
            errorMessage: 'Email is not registered. Try with other email.',
          });
          return;
        } else if (bcryptjs.compareSync(password, user.password)) {
          req.session.currentUser = user;
          console.log(user)

          res.redirect('/auth/profile');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch((error) => console.log(error));
});

//LOGOUT
router.post('/logout', isLoggedIn, (req, res) => {
    res.clearCookie('connect.sid')
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router;
