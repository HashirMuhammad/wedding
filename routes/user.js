const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        res.status(400).send('Invalid ID');
    }
});

// Create a new user
router.post('/', async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    // Check if email already exists
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        const user = new User({
            name,
            email,
            password,
            phone,
            role
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, password, phone, role },
            { new: true }
        );
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        res.status(400).send('Invalid ID');
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.status(204).send();
    } catch (err) {
        res.status(400).send('Invalid ID');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        // Compare plain text password with stored password
        if (user.password !== password) {
            return res.status(400).send('Invalid email or password');
        }

        // Send user details along with the success message
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});



module.exports = router;
