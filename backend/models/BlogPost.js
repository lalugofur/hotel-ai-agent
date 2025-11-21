const mongoose = require('mongoose');

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
  publishedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);