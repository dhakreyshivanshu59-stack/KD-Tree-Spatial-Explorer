const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    geohash: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// MongoDB 2dsphere index for fallback/persistence
locationSchema.index({ location: '2dsphere' });
locationSchema.index({ geohash: 1 });

module.exports = mongoose.model('Location', locationSchema);
