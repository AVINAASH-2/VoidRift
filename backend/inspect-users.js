const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const inspectUsers = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}).lean();
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            console.log(`User: ${user.username} (${user._id})`);
            console.log(`  Saved Videos:`, user.savedVideos);
            if (Array.isArray(user.savedVideos)) {
                user.savedVideos.forEach((v, i) => {
                    if (!mongoose.Types.ObjectId.isValid(v)) {
                        console.error(`    INVALID ID at index ${i}: ${v}`);
                    }
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

inspectUsers();
