require('dotenv').config();
const mongoose = require('mongoose');
const Location = require('./src/models/Location');

async function checkData() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spatialdb';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const count = await Location.countDocuments();
    console.log('Total documents:', count);

    if (count > 0) {
        const sample = await Location.findOne();
        console.log('Sample Document:', JSON.stringify(sample, null, 2));
    }

    await mongoose.disconnect();
}

checkData().catch(console.error);
