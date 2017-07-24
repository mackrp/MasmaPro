const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const Schema = mongoose.Schema;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email:{
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: "Please enter a valid email address",
    validate: [validator.isEmail, 'Invalid Email Address']

  },
  username:{
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: "Please enter a valid email address"
  }
  firstname: {
    type: String,
    required: "Please a enter your first name",
    trim: true
  },
  lastname: {
    type: String,
    required: "Please a enter your last name",
    trim: true
  },
  phone: {
    type: String
  },
  picture: {
    type: String
  },
  slug: {
    type: String
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  favorites: [
    {type: mongoose.Schema.ObjectId, ref: 'Listing'}
  ]
});

userSchema.virtual('gravatar').get(function(){
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email'});
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
