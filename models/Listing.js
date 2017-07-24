const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  listing_type:{
    type: [String],
    require: "Please Your Listing Type, For Rent or For Sale"
  },

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
  pic: [String],
  slug: String,
  property_type: [String],
  bedrooms: String,
  bathrooms: String,
  year: String,
  price: String,
  rent: String,
  square_feet: String,
  number_of_floors: String,
  garage_size: String,

  property_features: [String],
  lot_features: [String],
  community_features: [String],

  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [
      {
        type: Number,
        required: "You must supply coordinates"
      }
    ],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  },
  state: [String],

  created: {
    type: Date,
    default: Date.now
  },

  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }

},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

listingSchema.pre('save', async function(next){
  if (!this.isModified('title')){
    next();
    return;
  }
  this.slug = slug(this.title);
  // find other listings with the same title as slug
  const slugRegExp = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const listingWithSlug = await this.constructor.find({slug: slugRegExp});
  if(listingWithSlug.length){
    this.slug = `${this.slug}-${listingWithSlug.length + 1}`
  }
  next();
});

// listingSchema.pre('find', autopopulate);
// listingSchema.pre('findOne', autopopulate);



module.exports = mongoose.model('Listing', listingSchema);
