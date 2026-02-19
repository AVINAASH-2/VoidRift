const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/videos
// @desc    Create a new video
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        console.log("Creating video with body:", req.body);

        const { title, description, videoUrl, thumbnailUrl, category } = req.body;

        const video = await Video.create({
            title,
            description,
            videoUrl,
            thumbnailUrl,
            category,
            uploader: req.user.id,
            likes: [],
            dislikes: []
        });
        res.status(201).json({
            success: true,
            data: video
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/videos
// @desc    Get all videos
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const videos = await Video.find(query)
            .populate('uploader', 'username avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: videos.length,
            data: videos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/videos/trending
// @desc    Get trending videos (by views)
// @access  Public
router.get('/trending', async (req, res) => {
    try {
        const videos = await Video.find()
            .populate('uploader', 'username avatar')
            .sort({ views: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            count: videos.length,
            data: videos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/videos/:id
// @desc    Get single video and increment views
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate('uploader', 'username avatar');

        if (!video) {
            return res.status(404).json({ success: false, error: 'Video not found' });
        }

        // Increment views - REMOVED: Now handled by separate PUT request to avoid double-counting in React Strict Mode
        // video.views += 1;
        // await video.save();

        res.status(200).json({
            success: true,
            data: video
        });
    } catch (error) {
        console.error("Get Video Error:", error);

        // Debugging: Log error to file
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(__dirname, '../server_errors.log');
        const logEntry = `[${new Date().toISOString()}] GET /:id Error: ${error.message}\nStack: ${error.stack}\n\n`;
        try { fs.appendFileSync(logPath, logEntry); } catch (e) { }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   PUT /api/videos/:id/view
// @desc    Increment video views
// @access  Public
router.put('/:id/view', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ success: false, error: 'Video not found' });
        }

        video.views += 1;
        await video.save();

        res.status(200).json({ success: true, data: video });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});


// @route   PUT /api/videos/:id/like
// @desc    Like a video
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ success: false, error: 'Video not found' });
        }

        // Check if video has already been liked by this user
        if (video.likes.includes(req.user.id)) {
            // Un-like
            video.likes = video.likes.filter(id => id.toString() !== req.user.id);
        } else {
            // Like
            video.likes.push(req.user.id);
            // Remove from dislikes if present
            if (video.dislikes.includes(req.user.id)) {
                video.dislikes = video.dislikes.filter(id => id.toString() !== req.user.id);
            }
        }

        await video.save();

        res.status(200).json({ success: true, data: video });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   PUT /api/videos/:id/dislike
// @desc    Dislike a video
// @access  Private
router.put('/:id/dislike', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ success: false, error: 'Video not found' });
        }

        // Check if video has already been disliked
        if (video.dislikes.includes(req.user.id)) {
            // Un-dislike
            video.dislikes = video.dislikes.filter(id => id.toString() !== req.user.id);
        } else {
            // Dislike
            video.dislikes.push(req.user.id);
            // Remove from likes if present
            if (video.likes.includes(req.user.id)) {
                video.likes = video.likes.filter(id => id.toString() !== req.user.id);
            }
        }

        await video.save();

        res.status(200).json({ success: true, data: video });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});



// @route   DELETE /api/videos/:id
// @desc    Delete a video
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ success: false, error: 'Video not found' });
        }

        // Make sure user owns video
        if (video.uploader.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        // Delete associated comments explicitly if needed, but for now we restart with simple delete
        // ideally we should delete all comments associated with this video
        const Comment = require('../models/Comment');
        await Comment.deleteMany({ video: req.params.id });

        await video.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   POST /api/videos/:id/report
// @desc    Report a video
// @access  Private
router.post('/:id/report', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ success: false, error: 'Video not found' });
        }

        const { reason } = req.body;
        if (!reason) {
            return res.status(400).json({ success: false, error: 'Please provide a reason' });
        }

        const newReport = {
            user: req.user.id,
            reason
        };

        video.reports.push(newReport);
        await video.save();

        res.status(201).json({ success: true, data: video });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
