import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import Query from '../models/Query.js';

const router = express.Router();

// Create query (public)
router.post('/', async (req, res) => {
  try {
    const query = new Query(req.body);
    await query.save();
    res.status(201).json(query);
  } catch (error) {
    res.status(400).json({ message: 'Error creating query', error: error.message });
  }
});

// Get all queries (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const queries = await Query.find().populate('assignedTo', 'name email');
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update query status (Admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo },
      { new: true }
    ).populate('assignedTo', 'name email');
    
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    res.json(query);
  } catch (error) {
    res.status(400).json({ message: 'Error updating query', error: error.message });
  }
});

export default router;