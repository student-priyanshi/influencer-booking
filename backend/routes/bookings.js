import express from 'express';
import { adminAuth, auth } from '../middleware/auth.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Get all bookings (Admin only) or user's bookings
router.get('/', auth, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await Booking.find()
        .populate('user', 'name email')
        .populate('influencer')
        .populate('event')
        .populate('package');
    } else {
      bookings = await Booking.find({ user: req.user._id })
        .populate('influencer')
        .populate('event')
        .populate('package');
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      user: req.user._id
    });
    await booking.save();
    await booking.populate('influencer event package');
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
});

// Update booking status (Admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email').populate('influencer event package');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Error updating booking', error: error.message });
  }
});

export default router;