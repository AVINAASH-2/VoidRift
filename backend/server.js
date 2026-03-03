const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const uploadRoutes = require('./routes/upload');

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/videos', require('./routes/videos'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`VOIDRIFT SERVER: Operational on port ${PORT}`);
});
