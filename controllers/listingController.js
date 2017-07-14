const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');

exports.homePage = (req, res) => {
  res.render('index', {title: 'Hello World'});
};
