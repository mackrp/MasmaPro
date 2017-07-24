const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');
const User = mongoose.model('User');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next){
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto){
      next(null, true);
    }else{
      next({message: 'That filetype isn\'t allowed'}, false);
    }
  }
};

exports.homePage = (req, res) => {
  res.render('index', {title: 'Hello World'});
};

exports.addListings = (req, res) => {
  res.render('index');
};

exports.upload = multer(multerOptions).single('pic');
exports.resize = async (req, res, next) => {
  if(!req.file){
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.pic = `${uuid.v4()}.${extension}`;
  const pic = await jimp.read(req.file.buffer);
  await pic.resize(800, jimp.AUTO);
  await pic.write(`.public/uploads/${req.body.pic}`);
  next();
};

exports.createListing = async (req, res) => {
  req.body.author = req.user._id;
  const listing = await (new Listing(req.body)).save();
  req.flash('success', `Successfully Created ${listing.title}`);
  res.redirect(`/listing/${listing.slug}`);
};

exports.getListings  = async (req, res) => {
  const page = req.params.page || 1;
  const limit = 4;
  const skip = (page * limit) - limit;
  const listingsPromise = Listing
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc'});

  const countPromise = Listing.count();
  const [listings, count] = await Promise.all([listingsPromise, countPromise]);
  const pages = Math.ceil(count/limit);
  if(!listings.length && skip){
    req.flash('info', `Hey, the page ${page} you asked for doen't exist. So I redirect you to page ${pages}`);
    res.redirect(`/listings/page/${pages}`);
    return;
  }
  res.render('listings', {title: "Listings", listings, page, pages, count });
};
