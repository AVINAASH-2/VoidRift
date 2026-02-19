const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [5000, 'Description cannot be more than 5000 characters']
    },
    videoUrl: {
        type: String,
        required: [true, 'Please add a video URL']
    },
    thumbnailUrl: {
        type: String,
        default: 'https://via.placeholder.com/320x180.png?text=No+Thumbnail'
    },
    category: {
        type: String,
        default: 'All',
        enum: ['All', 'Music', 'Gaming', 'News', 'Sports', 'Education', 'Entertainment', 'Technology', 'Travel']
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reports: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reason: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Video', VideoSchema);
