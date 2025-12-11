import mongoose from 'mongoose';

const influencerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  expertise: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  price: {
    type: Number,
    required: true
  },
  socialMedia: {
    instagram: String,
    youtube: String,
    tiktok: String,
    twitter: String
  },
  availability: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Influencer', influencerSchema);