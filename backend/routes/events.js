import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import Event from '../models/Event.js';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('influencer');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get event categories
router.get('/categories', async (req, res) => {
  const categories = [
    { id: 1, name: 'Birthday Party', description: 'Celebrate special birthdays' },
    { id: 2, name: 'Engagement', description: 'Memorable engagement events' },
    { id: 3, name: 'Wedding', description: 'Beautiful wedding celebrations' },
    { id: 4, name: 'Corporate Event', description: 'Professional corporate gatherings' },
    { id: 5, name: 'Product Launch', description: 'Exciting product releases' },
    { id: 6, name: 'Charity Event', description: 'Meaningful charity functions' },
    { id: 7, name: 'Music Concert', description: 'Live music performances' },
    { id: 8, name: 'Sports Event', description: 'Athletic competitions' }
  ];
  res.json(categories);
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('influencer');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create event (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    await event.populate('influencer');
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event', error: error.message });
  }
});

// Update event (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('influencer');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error updating event', error: error.message });
  }
});

// Delete event (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;