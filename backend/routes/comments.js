const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Video = require('../models/Video');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/comments/:videoId
// @desc    Get comments for a video
// @access  Public
router.get('/:videoId', async (req, res) => {
    try {
        const comments = await Comment.find({ video: req.params.videoId })
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: comments.length, data: comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   POST /api/comments/:videoId
// @desc    Add a comment to a video
// @access  Private
router.post('/:videoId', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);

        if (!video) {
            return res.status(404).json({ success: false, error: 'Video not found' });
        }

        const comment = await Comment.create({
            text: req.body.text,
            video: req.params.videoId,
            user: req.user.id
        });

        // Populate user details for immediate display
        await comment.populate('user', 'username avatar');

        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, error: 'Comment not found' });
        }

        // Make sure user owns comment
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await comment.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   POST /api/comments/:id/report
// @desc    Report a comment
// @access  Private
router.post('/:id/report', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, error: 'Comment not found' });
        }

        const { reason } = req.body;
        if (!reason) {
            return res.status(400).json({ success: false, error: 'Please provide a reason' });
        }

        const newReport = {
            user: req.user.id,
            reason
        };

        comment.reports.push(newReport);
        await comment.save();

        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
