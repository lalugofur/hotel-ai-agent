const mongoose = require('mongoose');

// hotel data
const hotelSchema = new mongoose.Schema({
  name: String,
  price: Number,
  rating: Number,
  location: String,
  amenities: [String],
  image: String,
  description: String,
  scrapedAt: Date
});

// for blog post
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  excerpt: String,
  location: String,
  hotelData: [hotelSchema],
  socialPosts: {
    twitter: String,
    facebook: String,
    instagram: String
  },
  publishedAt: { type: Date, default: Date.now } // auto timestamp
});

module.exports = mongoose.model('BlogPost', blogPostSchema);