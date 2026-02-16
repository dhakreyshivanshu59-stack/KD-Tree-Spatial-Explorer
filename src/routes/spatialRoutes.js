const express = require('express');
const router = express.Router();
const spatialController = require('../controllers/spatialController');

router.get('/range', spatialController.rangeQuery);
router.get('/nearest', spatialController.nearestNeighborQuery);
router.get('/all', spatialController.getAllLocations);
router.get('/rebuild', spatialController.rebuildTree);
router.post('/rebuild', spatialController.rebuildTree);

module.exports = router;
