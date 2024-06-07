const express = require('express');
const router = express.Router();
const Hall = require('../models/Hall'); // Adjust the path if necessary
const User = require('../models/User'); // Adjust the path if necessary

// Create a new hall
router.post('/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const { name, description, location, dimensions } = req.body;
    const hall = new Hall({
      name,
      description,
      location,
      dimensions,
      userid
    });
    const savedHall = await hall.save();
    // Add the hallid to the user's hallids array
    const user = await User.findById(userid); // Assuming you have a User model
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.hallids.push(savedHall._id);
    await user.save();

    res.status(201).json(savedHall);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all halls for a specific user
router.get('/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const halls = await Hall.find({ userid });
    res.status(200).json(halls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single hall by ID
router.get('/:userid/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hall = await Hall.findById(id);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });
    res.status(200).json(hall);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a hall by ID
router.put('/:userid/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, dimensions } = req.body;
    const hall = await Hall.findByIdAndUpdate(
      id,
      { name, description, location, dimensions },
      { new: true, runValidators: true }
    );
    if (!hall) return res.status(404).json({ message: 'Hall not found' });
    res.status(200).json(hall);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a hall by ID
router.delete('/:userid/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hall = await Hall.findByIdAndDelete(id);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });
    res.status(200).json({ message: 'Hall deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
