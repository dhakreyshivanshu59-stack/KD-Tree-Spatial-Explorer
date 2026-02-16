const Location = require('../models/Location');
const KDTree = require('../kdtree/KDTree');

class KDTreeService {
    constructor() {
        this.tree = null;
    }

    /**
     * Rebuilds the KD-tree from MongoDB data.
     * This ensures the tree is balanced and up-to-date.
     */
    async rebuild() {
        console.log('Rebuilding KD-Tree from MongoDB...');
        const locations = await Location.find({});
        const points = locations.map(loc => ({
            id: loc._id,
            name: loc.name,
            coordinates: loc.location.coordinates,
            geohash: loc.geohash
        }));

        this.tree = new KDTree(points);
        console.log(`KD-Tree rebuilt with ${points.length} nodes.`);
        return points.length;
    }

    rangeSearch(minLng, minLat, maxLng, maxLat) {
        if (!this.tree) return [];
        return this.tree.rangeSearch([minLng, minLat, maxLng, maxLat]);
    }

    nearestNeighbor(lng, lat, k) {
        if (!this.tree) return [];
        return this.tree.nearestNeighbor([lng, lat], k);
    }

    getAll() {
        if (!this.tree) return [];
        return this.tree.getAllPoints();
    }
}

// Singleton instance
module.exports = new KDTreeService();
