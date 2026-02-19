const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');

dotenv.config();

const clearData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Drop the videos collection completely
        try {
            await mongoose.connection.collection('videos').drop();
            console.log('Dropped videos collection');
        } catch (err) {
            console.log('Collection might not exist or verify drop failed:', err.message);
        }

        console.log('Database cleared of videos.');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

clearData();
