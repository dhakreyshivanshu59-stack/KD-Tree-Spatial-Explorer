const mongoose = require('mongoose');
const Location = require('../src/models/Location');
const { encode } = require('../src/utils/coordinateHash');

const mongoUri = 'mongodb://localhost:27017/spatialdb';

const indiaLocations = [
    { name: 'Gateway of India, Mumbai', lat: 18.9220, lng: 72.8347 },
    { name: 'Red Fort, Delhi', lat: 28.6562, lng: 77.2410 },
    { name: 'Lalbagh Botanical Garden, Bangalore', lat: 12.9507, lng: 77.5848 },
    { name: 'Charminar, Hyderabad', lat: 17.3616, lng: 78.4747 },
    { name: 'Sabarmati Ashram, Ahmedabad', lat: 23.0605, lng: 72.5800 },
    { name: 'Marina Beach, Chennai', lat: 13.0494, lng: 80.2824 },
    { name: 'Victoria Memorial, Kolkata', lat: 22.5448, lng: 88.3426 },
    { name: 'Shaniwar Wada, Pune', lat: 18.5197, lng: 73.8553 },
    { name: 'Hawa Mahal, Jaipur', lat: 26.9239, lng: 75.8267 },
    { name: 'Dutch Garden, Surat', lat: 21.1960, lng: 72.8223 },
    { name: 'Taj Mahal, Agra', lat: 27.1751, lng: 78.0421 },
    { name: 'Golden Temple, Amritsar', lat: 31.6200, lng: 74.8765 },
    { name: 'Dashashwamedh Ghat, Varanasi', lat: 25.3176, lng: 83.0062 },
    { name: 'City Palace, Udaipur', lat: 24.5764, lng: 73.6835 },
    { name: 'Fort Kochi, Kochi', lat: 9.9658, lng: 76.2421 },
    { name: 'Mall Road, Shimla', lat: 31.1048, lng: 77.1734 },
    { name: 'Kamakhya Temple, Guwahati', lat: 26.1661, lng: 91.7061 },
    { name: 'Bara Imambara, Lucknow', lat: 26.8693, lng: 80.9125 },
    { name: 'Lingaraj Temple, Bhubaneswar', lat: 20.2382, lng: 85.8338 },
    { name: 'Golghar, Patna', lat: 25.6207, lng: 85.1311 },
    { name: 'Dal Lake, Srinagar', lat: 34.0837, lng: 74.7973 },
    { name: 'Miramar Beach, Panaji', lat: 15.4800, lng: 73.8100 },
    { name: 'Upper Lake, Bhopal', lat: 23.2500, lng: 77.4100 },
    { name: 'Pahari Mandir, Ranchi', lat: 23.3500, lng: 85.3300 },
    { name: 'Marine Drive, Raipur', lat: 21.2500, lng: 81.6300 }
];

async function seed() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB for India seeding...');

        await Location.deleteMany({});
        console.log('Cleared existing locations.');

        const locationsToInsert = indiaLocations.map(loc => ({
            name: loc.name,
            location: {
                type: 'Point',
                coordinates: [loc.lng, loc.lat]
            },
            geohash: encode(loc.lat, loc.lng)
        }));

        await Location.insertMany(locationsToInsert);
        console.log(`Successfully seeded ${locationsToInsert.length} Indian locations.`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
