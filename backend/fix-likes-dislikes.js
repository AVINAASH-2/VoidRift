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

const fixData = async () => {
    await connectDB();

    try {
        const videos = await Video.find({});
        console.log(`Found ${videos.length} videos. Checking for invalid likes/dislikes...`);

        let updatedCount = 0;

        for (const video of videos) {
            let isModified = false;

            // Filter valid ObjectIds for likes
            const validLikes = video.likes.filter(id => mongoose.Types.ObjectId.isValid(id) && id.toString() !== '0');
            if (validLikes.length !== video.likes.length) {
                console.log(`Video ${video._id}: Fixing likes (was ${video.likes.length}, now ${validLikes.length})`);
                video.likes = validLikes;
                isModified = true;
            }

            // Filter valid ObjectIds for dislikes
            const validDislikes = video.dislikes.filter(id => mongoose.Types.ObjectId.isValid(id) && id.toString() !== '0');
            if (validDislikes.length !== video.dislikes.length) {
                console.log(`Video ${video._id}: Fixing dislikes (was ${video.dislikes.length}, now ${validDislikes.length})`);
                video.dislikes = validDislikes;
                isModified = true;
            }

            if (isModified) {
                // Determine if we need to bypass validation to save invalid data FIRST (catch-22)?
                // No, setting them to valid arrays should allow save to pass validation.
                await video.save();
                updatedCount++;
            }
        }

        console.log(`Finished! Updated ${updatedCount} videos.`);

    } catch (error) {
        console.error('Error fixing data:', error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

fixData();
