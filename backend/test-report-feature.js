const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');
const Comment = require('./models/Comment');
const User = require('./models/User'); // Import User model

// Load env vars
dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const verifyFeatures = async () => {
    await connectDB();

    try {
        // 1. Fetch a video
        const video = await Video.findOne();
        if (!video) {
            console.log('No videos found to test');
            process.exit(0);
        }
        console.log(`Testing with video: ${video.title} (${video._id})`);

        // 2. Fetch a user to be the reporter
        const reporter = await User.findOne();
        if (!reporter) {
            console.log('No users found to test reporting');
            process.exit(0);
        }

        // Fix missing uploader if necessary
        if (!video.uploader) {
            console.log('Video missing uploader, fixing...');
            video.uploader = reporter._id;
            await video.save();
        }

        // 3. Test Report Video (Simulating DB update directly as we can't easily auth via script without login flow)
        // In a real integration test we would hit the API. Here we verify the Model change works.
        // We will manually push a report to verify the schema.
        console.log('Testing Report Schema...');
        video.reports.push({
            user: reporter._id,
            reason: 'Test Report via Script'
        });
        await video.save();
        console.log('Video report saved successfully.');

        const updatedVideo = await Video.findById(video._id);
        if (updatedVideo.reports.length > 0 && updatedVideo.reports[updatedVideo.reports.length - 1].reason === 'Test Report via Script') {
            console.log('VERIFICATION PASSED: Video Report persisted.');
        } else {
            console.log('VERIFICATION FAILED: Video Report not found.');
        }

        // 4. Test Report Comment
        const comment = await Comment.findOne({ video: video._id });
        if (comment) {
            console.log(`Testing with comment: ${comment._id}`);
            comment.reports.push({
                user: reporter._id,
                reason: 'Test Comment Report'
            });
            await comment.save();
            console.log('Comment report saved successfully.');

            const updatedComment = await Comment.findById(comment._id);
            if (updatedComment.reports.length > 0 && updatedComment.reports[updatedComment.reports.length - 1].reason === 'Test Comment Report') {
                console.log('VERIFICATION PASSED: Comment Report persisted.');
            } else {
                console.log('VERIFICATION FAILED: Comment Report not found.');
            }
        } else {
            console.log('No comments found on this video to test.');
        }

    } catch (error) {
        console.error('Verification Error:', require('util').inspect(error, { depth: null, colors: true }));
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

verifyFeatures();
