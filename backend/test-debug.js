const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected');

        const user = await User.findOne();
        console.log('User:', user ? user._id.toString() : 'Not Found');

        const video = await Video.findOne();
        console.log('Video:', video ? video._id.toString() : 'Not Found');

        if (user && video) {
            console.log('Video Uploader before:', video.uploader);
            if (!video.uploader) {
                console.log('Fixing missing uploader...');
                video.uploader = user._id;
            }

            video.reports.push({
                user: user._id,
                reason: 'Debug Report'
            });

            console.log('Pushing report...');
            await video.validate();
            console.log('Validation passed');

            // await video.save(); // Don't save for now, just validate
            // console.log('Save passed');
        }

    } catch (e) {
        console.error('Error:', e.message);
        if (e.errors) {
            Object.keys(e.errors).forEach(key => {
                console.error(`Field: ${key}, Message: ${e.errors[key].message}, Kind: ${e.errors[key].kind}`);
            });
        }
    } finally {
        await mongoose.disconnect();
    }
};

run();
