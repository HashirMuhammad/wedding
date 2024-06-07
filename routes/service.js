const express = require('express');
const router = express.Router();
const Service = require('../models/Service'); // Adjust the path as necessary
const User = require('../models/User'); // Adjust the path as necessary

// Create a new service
router.post('/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const { name, description, price } = req.body;

    const service = new Service({
      name,
      description,
      price,
      userid
    });

    const savedService = await service.save();
    // Add the hallid to the user's hallids array
    const user = await User.findById(userid); // Assuming you have a User model
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.serviceids.push(savedService._id);
    await user.save();

    res.status(201).json(savedService);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single service by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Service ID format' });
    }

    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a service by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Service ID format' });
    }

    const updatedService = await Service.findByIdAndUpdate(id, {
      name,
      description,
      price
    }, { new: true });

    if (!updatedService) return res.status(404).json({ message: 'Service not found' });

    res.status(200).json(updatedService);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a service by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Service ID format' });
    }

    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) return res.status(404).json({ message: 'Service not found' });

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
