const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(uri)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('CONNECTION FAILED:');
        console.error('Name:', err.name);
        console.error('Message:', err.message);
        if (err.reason) console.error('Reason:', err.reason);
        if (err.code) console.error('Code:', err.code);
        process.exit(1);
    });
