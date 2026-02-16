require('dotenv').config();
const mongoose = require('mongoose');
const Location = require('../src/models/Location');
const { encode } = require('../src/utils/coordinateHash');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spatialdb';

const sampleLocations = [
    { name: 'Central Park', lat: 40.785091, lng: -73.968285 },
    { name: 'Times Square', lat: 40.758896, lng: -73.985130 },
    { name: 'Empire State Building', lat: 40.748441, lng: -73.985664 },
    { name: 'Statue of Liberty', lat: 40.689247, lng: -74.044502 },
    { name: 'Brooklyn Bridge', lat: 40.706086, lng: -73.996864 },
    { name: 'Wall Street', lat: 40.706013, lng: -74.008827 },
    { name: 'Grand Central Terminal', lat: 40.752726, lng: -73.977229 },
    { name: 'Chrysler Building', lat: 40.751622, lng: -73.975291 },
    { name: 'High Line', lat: 40.747993, lng: -74.004765 },
    { name: 'One World Trade Center', lat: 40.712743, lng: -74.013379 }
];

async function seed() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB for seeding...');

        await Location.deleteMany({});
        console.log('Cleared existing locations.');

        const locationsToInsert = sampleLocations.map(loc => ({
            name: loc.name,
            location: {
                type: 'Point',
                coordinates: [loc.lng, loc.lat]
            },
            geohash: encode(loc.lat, loc.lng)
        }));

        await Location.insertMany(locationsToInsert);
        console.log(`Successfully seeded ${locationsToInsert.length} locations.`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
