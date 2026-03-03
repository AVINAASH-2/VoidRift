const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Video = require('../models/Video');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/users/saved
// @desc    Get saved videos
// @access  Private
router.get('/saved', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'savedVideos',
            populate: {
                path: 'uploader',
                select: 'username avatar'
            }
        });

        res.status(200).json({ success: true, data: user.savedVideos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/users/history
// @desc    Get watch history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'history',
            populate: {
                path: 'uploader',
                select: 'username avatar'
            }
        });

        res.status(200).json({ success: true, data: user.history });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   PUT /api/users/history/:videoId
// @desc    Add video to history
// @access  Private
router.put('/history/:videoId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Remove if already exists (to move to top)
        user.history = user.history.filter(id => id.toString() !== req.params.videoId);

        // Add to front
        user.history.unshift(req.params.videoId);

        // Limit history to 50 items
        if (user.history.length > 50) {
            user.history.pop();
        }

        await user.save();
        res.status(200).json({ success: true, data: user.history });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/users/liked
// @desc    Get liked videos
// @access  Private
router.get('/liked', protect, async (req, res) => {
    try {
        // Find videos where likes array contains user id
        const videos = await Video.find({ likes: req.user.id })
            .populate('uploader', 'username avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: videos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   PUT /api/users/saved/:videoId
// @desc    Toggle save video
// @access  Private
router.put('/saved/:videoId', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);

        if (!video) {
            return res.status(404).json({ success: false, error: 'Video not found' });
        }

        const user = await User.findById(req.user.id);

        // Check if already saved
        if (user.savedVideos.includes(req.params.videoId)) {
            // Unsave
            user.savedVideos = user.savedVideos.filter(id => id.toString() !== req.params.videoId);
        } else {
            // Save
            user.savedVideos.push(req.params.videoId);
        }

        await user.save();

        res.status(200).json({ success: true, data: user.savedVideos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/users/:id
// @desc    Get user profile and their videos
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const videos = await Video.find({ uploader: req.params.id })
            .populate('uploader', 'username avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                user,
                videos
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
