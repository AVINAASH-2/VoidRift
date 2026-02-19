const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');

dotenv.config();

const fixData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Unset
        const unsetRes = await Video.collection.updateMany(
            {},
            { $unset: { likes: "", dislikes: "" } }
        );
        console.log('Unset result:', unsetRes);

        // 2. Set to empty array
        const setRes = await Video.collection.updateMany(
            {},
            { $set: { likes: [], dislikes: [] } }
        );
        console.log('Set result:', setRes);

        console.log('All videos updated successfully');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixData();
