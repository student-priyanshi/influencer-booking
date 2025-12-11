import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import Influencer from '../models/Influencer.js';

const router = express.Router();

// Get all influencers
router.get('/', async (req, res) => {
  try {
    const influencers = await Influencer.find();
    res.json(influencers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single influencer
router.get('/:id', async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json(influencer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create influencer (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const influencer = new Influencer(req.body);
    await influencer.save();
    res.status(201).json(influencer);
  } catch (error) {
    res.status(400).json({ message: 'Error creating influencer', error: error.message });
  }
});

// Update influencer (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const influencer = await Influencer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json(influencer);
  } catch (error) {
    res.status(400).json({ message: 'Error updating influencer', error: error.message });
  }
});

// Delete influencer (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const influencer = await Influencer.findByIdAndDelete(req.params.id);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json({ message: 'Influencer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;