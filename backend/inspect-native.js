const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');

dotenv.config({ path: './.env' });

const inspectNative = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        const collection = Video.collection;

        const videos = await collection.find({}).toArray();
        console.log(`Found ${videos.length} videos.`);

        for (const video of videos) {
            if ((video.likes && video.likes.length > 0) || (video.dislikes && video.dislikes.length > 0)) {
                console.log(`Video: ${video._id}`);
                console.log(`  Likes:`, video.likes, `Type: ${typeof video.likes}, IsArray: ${Array.isArray(video.likes)}`);
                if (Array.isArray(video.likes)) {
                    video.likes.forEach((l, i) => console.log(`    Like[${i}]: ${l} (Type: ${typeof l})`));
                }
                console.log(`  Dislikes:`, video.dislikes, `Type: ${typeof video.dislikes}, IsArray: ${Array.isArray(video.dislikes)}`);
                if (Array.isArray(video.dislikes)) {
                    video.dislikes.forEach((l, i) => console.log(`    Dislike[${i}]: ${l} (Type: ${typeof l})`));
                }
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

inspectNative();
