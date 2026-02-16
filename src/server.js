require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const kdTreeService = require('./services/kdTreeService');

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spatialdb';

mongoose.connect(mongoUri)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Build initial tree on startup
        await kdTreeService.rebuild();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
