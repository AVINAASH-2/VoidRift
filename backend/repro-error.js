const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');

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

const repro = async () => {
    await connectDB();

    try {
        const videos = await Video.find({});
        console.log(`Found ${videos.length} videos. Attempting to save each...`);

        for (const video of videos) {
            try {
                // Simulate the view increment
                video.views += 1;
                await video.save();
                console.log(`Video ${video._id}: Save Success`);
            } catch (err) {
                console.error(`Video ${video._id}: Save Failed - ${err.message}`);
                // console.error(err);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

repro();
