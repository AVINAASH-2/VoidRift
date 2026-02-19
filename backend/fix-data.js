const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');

dotenv.config();

const fixData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Bypass Mongoose validation by using the native driver
        // This is crucial because Mongoose crashes on 'find' if the data doesn't match the schema

        console.log('Clearing likes and dislikes directly via collection driver...');

        // First unset them to remove the bad type
        await Video.collection.updateMany(
            {},
            { $unset: { likes: "", dislikes: "" } }
        );

        // Then set them to empty arrays
        await Video.collection.updateMany(
            {},
            { $set: { likes: [], dislikes: [] } }
        );

        console.log('All videos updated successfully');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixData();
