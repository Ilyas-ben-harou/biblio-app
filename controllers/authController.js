const User = require('../models/User');
const passport = require('passport');
const { validationResult } = require('express-validator');

// Register page
exports.getRegister = (req, res) => {
  res.render('auth/register', {
    title: 'Register'
  });
};

// Register handle
exports.postRegister = async (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('auth/register', {
      title: 'Register',
      errors: errors.array(),
      name,
      email
    });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      errors.push({ msg: 'Email is already registered' });
      return res.render('auth/register', {
        title: 'Register',
        errors,
        name,
        email
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password
    });

    await newUser.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Server Error');
    res.redirect('/auth/register');
  }
};

// Login page
exports.getLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login'
  });
};

// Login handle
exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
};

// Logout handle
exports.logout = (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
  });
};