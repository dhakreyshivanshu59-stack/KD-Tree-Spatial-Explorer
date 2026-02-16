const geohash = require('ngeohash');

/**
 * Encodes coordinates into a geohash string.
 * This acts as the "Unix coordinate hashing" mentioned in requirements.
 */
const encode = (lat, lng, precision = 9) => {
    return geohash.encode(lat, lng, precision);
};

const decode = (hash) => {
    return geohash.decode(hash);
};

module.exports = {
    encode,
    decode
};
