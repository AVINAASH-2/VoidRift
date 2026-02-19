const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const Video = require('./models/Video');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedFromYoutube = async () => {
    await connectDB();

    try {
        if (!YOUTUBE_API_KEY) {
            console.error('YOUTUBE_API_KEY is missing in .env');
            process.exit(1);
        }

        // Get a default uploader
        const uploader = await User.findOne();
        if (!uploader) {
            console.error('No users found to assign as uploader');
            process.exit(1);
        }
        console.log(`Using uploader: ${uploader.username}`);

        // Fetch popular videos from YouTube
        // categoryId=10 (Music), 20 (Gaming), 17 (Sports) etc can be added for variety
        // For now, let's get 'mostPopular'
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,statistics,player',
                chart: 'mostPopular',
                regionCode: 'US',
                maxResults: 20,
                key: YOUTUBE_API_KEY
            }
        });

        const videos = response.data.items;
        console.log(`Fetched ${videos.length} videos from YouTube`);

        // Transform and Save
        for (const item of videos) {
            const videoData = {
                title: item.snippet.title.substring(0, 100), // Enforce schema limit
                description: item.snippet.description.substring(0, 500) || 'No description',
                videoUrl: `https://www.youtube.com/embed/${item.id}`, // Use embed URL or watch URL? Schema expects string.
                // Note: The schema expects a videoUrl. For a clone, we might embed.
                // But the current frontend uses <video src={videoUrl}> which implies a direct file URL.
                // YouTube embed URLs won't work in a <video> tag. They need an <iframe>.
                // However, the user asked to "use this for videos".
                // If the frontend uses <video>, we need direct links (mp4). YouTube API doesn't give that.
                // We might need to change the frontend to support YouTube Embeds OR
                // assume the user effectively wants to switch to "YouTube Embed" mode.

                // Let's assume for now we store the Embed URL and update the frontend if needed.
                // Or maybe the user has a way to get direct links? Unlikely.
                // Standard approach: Store the YouTube ID or Embed URL, and update Frontend to use <iframe> if isYouTube.

                thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
                category: 'Entertainment', // Default, or map from item.snippet.categoryId
                uploader: uploader._id,
                views: parseInt(item.statistics.viewCount) || 0,
                likes: [], // We can't easily sync real likes users
                dislikes: []
            };

            // Upsert based on title/description similarity? Or just Create?
            // Let's just create for now, maybe check if title exists to avoid duplicates
            const exists = await Video.findOne({ title: videoData.title });
            if (!exists) {
                await Video.create(videoData);
                console.log(`Added: ${videoData.title}`);
            } else {
                console.log(`Skipped (exists): ${videoData.title}`);
            }
        }

        console.log('Seeding complete!');

    } catch (error) {
        console.error('Error seeding data:', error.response ? error.response.data : error.message);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seedFromYoutube();
