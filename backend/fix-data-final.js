const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');
const User = require('./models/User');

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

const fixDataFinal = async () => {
    await connectDB();

    try {
        // Get a valid user to assign as uploader
        const user = await User.findOne();
        if (!user) {
            console.error('No users found! Cannot fix missing uploader.');
            process.exit(1);
        }
        console.log(`Using user ${user.username} (${user._id}) as default uploader.`);

        const videos = await Video.find({});
        console.log(`Found ${videos.length} videos.`);

        let updatedCount = 0;

        for (const video of videos) {
            let isModified = false;

            // Fix missing uploader
            if (!video.uploader) {
                console.log(`Video ${video._id}: Missing uploader. Fixing...`);
                video.uploader = user._id;
                isModified = true;
            }

            // Sanitize likes/dislikes (reset if potentially corrupted or just to be safe)
            // We'll check if they are valid first.
            if (!Array.isArray(video.likes)) {
                console.log(`Video ${video._id}: Likes is not array. Resetting.`);
                video.likes = [];
                isModified = true;
            }

            if (!Array.isArray(video.dislikes)) {
                console.log(`Video ${video._id}: Dislikes is not array. Resetting.`);
                video.dislikes = [];
                isModified = true;
            }

            if (isModified) {
                await video.save();
                updatedCount++;
                console.log(`Video ${video._id}: Saved successfully.`);
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

fixDataFinal();
