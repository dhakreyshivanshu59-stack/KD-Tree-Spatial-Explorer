const kdTreeService = require('../services/kdTreeService');

const rangeQuery = async (req, res) => {
    try {
        const { minLng, minLat, maxLng, maxLat } = req.query;
        if (!minLng || !minLat || !maxLng || !maxLat) {
            return res.status(400).json({ error: 'Missing coordinates' });
        }

        const results = kdTreeService.rangeSearch(
            parseFloat(minLng),
            parseFloat(minLat),
            parseFloat(maxLng),
            parseFloat(maxLat)
        );

        res.json({ count: results.length, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const nearestNeighborQuery = async (req, res) => {
    try {
        const { lng, lat, limit = 5 } = req.query;
        if (!lng || !lat) {
            return res.status(400).json({ error: 'Missing lng/lat' });
        }

        const results = kdTreeService.nearestNeighbor(
            parseFloat(lng),
            parseFloat(lat),
            parseInt(limit)
        );

        res.json({ count: results.length, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const rebuildTree = async (req, res) => {
    try {
        const count = await kdTreeService.rebuild();
        res.json({ message: 'Tree rebuilt successfully', count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllLocations = async (req, res) => {
    try {
        const results = kdTreeService.getAll();
        res.json({ count: results.length, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    rangeQuery,
    nearestNeighborQuery,
    rebuildTree,
    getAllLocations
};
