const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide all fields' });
        }

        // Check user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ success: false, error: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                success: true,
                _id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ success: false, error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/auth/me
// @desc    Get user data
// @access  Private
const { protect } = require('../middleware/authMiddleware');
router.get('/me', protect, async (req, res) => {
    res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = router;
