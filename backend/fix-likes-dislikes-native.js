const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');

dotenv.config({ path: './.env' });

const fixDataNative = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Access native collection
        const collection = Video.collection;

        // Find documents where likes is ["0"] or contains "0"
        // In MongoDB, querying an array for a value checks if the array contains that value.
        // If the value in DB is literally the string "0", this should find it.
        const badLikes = await collection.find({ likes: "0" }).toArray();
        console.log(`Found ${badLikes.length} videos with likes containing '0'.`);

        if (badLikes.length > 0) {
            console.log('Sample bad doc:', badLikes[0]._id, badLikes[0].likes);

            // Fix them
            const result = await collection.updateMany(
                { likes: "0" },
                { $set: { likes: [] } }
            );
            console.log(`Updated ${result.modifiedCount} videos (cleared likes).`);
        }

        // Check dislikes too
        const badDislikes = await collection.find({ dislikes: "0" }).toArray();
        console.log(`Found ${badDislikes.length} videos with dislikes containing '0'.`);

        if (badDislikes.length > 0) {
            const result = await collection.updateMany(
                { dislikes: "0" },
                { $set: { dislikes: [] } }
            );
            console.log(`Updated ${result.modifiedCount} videos (cleared dislikes).`);
        }

        // Also check if likes is just NOT an array of ObjectIds?
        // Using $not: { $type: "objectId" } matches strictly? 
        // Queries on arrays are tricky.
        // Let's indiscriminately clean up any '0' entries.

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

fixDataNative();
