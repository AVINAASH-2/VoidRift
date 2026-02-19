const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');

dotenv.config({ path: './.env' });

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const videos = await Video.find({}).sort({ createdAt: -1 }).limit(10);
        console.log(`Found ${videos.length} recent videos.`);

        for (const video of videos) {
            console.log(`Title: ${video.title}`);
            console.log(`URL: ${video.videoUrl}`);
            if (video.videoUrl.includes('youtube.com/embed')) {
                console.log('✅ Valid YouTube Embed URL');
            } else {
                console.log('❌ Not a YouTube Embed URL');
            }
            console.log('---');
        }

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

verify();
