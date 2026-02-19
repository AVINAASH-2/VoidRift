const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');

dotenv.config({ path: './.env' });

const inspectData = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected`);

        // Use lean() to get raw JS objects
        const videos = await Video.find({}).lean();
        console.log(`Found ${videos.length} videos.`);

        for (const video of videos) {
            console.log(`Video ID: ${video._id}`);
            console.log(`Likes: ${JSON.stringify(video.likes)} (Type: ${typeof video.likes})`);
            console.log(`Dislikes: ${JSON.stringify(video.dislikes)}`);

            if (Array.isArray(video.likes)) {
                video.likes.forEach((like, index) => {
                    console.log(`  Like[${index}]: ${like} (Type: ${typeof like})`);
                });
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

inspectData();
