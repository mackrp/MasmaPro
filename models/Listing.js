const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    trim: true,
    require: "Please enter title for your listing"
  },
  description:{
    type: String,
    trim: true,
    require: "Please enter some description for your listing"
  },
  slug: String,
  categories: [String],
  
})


module.exports = mongoose.model('Listing', listingSchema);
