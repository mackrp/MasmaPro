const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', {title: 'Login'});
};

exports.registerForm = (req, res) => {
  res.render('register', {title: 'Signup'});
};

exports.validateRegister = (req,res, next) => {
  req.sanitizeBody('firstname');
  req.checkBody('firstname', 'You must supply your first name').notEmpty();
  req.sanitizeBody('lastname');
  req.checkBody('lastname', 'You must supply your last name').notEmpty();
  req.sanitizeBody('username');
  req.checkBody('username', 'You must supply a username').notEmpty();
  req.checkBody('email', 'The email is not valid').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password cannot be blank').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password cannot be blank').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your password do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if(errors){
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return; //stop the function from runnnig
  }
  next(); //there were no errors

};

exports.register = async (req, res, next ) => {
  const user = new User({
    email: req.body.email,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname
   });
  // User.register(user, req.body.password, function(err, user){});
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next(); //pass to autoController login
};

exports.profile = async (req, res, next ) => {
  const user = await User.findOne({_id: req.user._id});
  if(!user) return next();
  res.render('profile', { user, title: user.firstname});
};

exports.editProfile = (req, res ) => {
  res.render('editProfile', {title: 'Edit Your Profile'});
};

exports.updateProfile = async (req, res) => {
  const updates = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    logo: req.body.logo,
    company_name: req.body.company_name,
    agency_name: req.body.agency_name,
    address: req.body.address,
    website: req.body.website
  };
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    {$set: updates },
    {new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'Profile updated successfully!');
  res.redirect('/profile');
};

exports.forgotPasswordForm = (req, res) => {
  res.render('forgot', {title: 'Forgot Password'});
};
