class Node {
    constructor(point, axis, left = null, right = null) {
        this.point = point; // { id, coordinates: [lng, lat], geohash }
        this.axis = axis;
        this.left = left;
        this.right = right;
    }
}

class KDTree {
    constructor(points) {
        this.root = this.build(points, 0);
    }

    build(points, depth) {
        if (points.length === 0) return null;

        const axis = depth % 2; // 0 for longitude, 1 for latitude

        // Sort points and choose median to ensure a balanced tree
        points.sort((a, b) => a.coordinates[axis] - b.coordinates[axis]);
        const medianIdx = Math.floor(points.length / 2);

        const node = new Node(
            points[medianIdx],
            axis,
            this.build(points.slice(0, medianIdx), depth + 1),
            this.build(points.slice(medianIdx + 1), depth + 1)
        );

        return node;
    }

    /**
     * Spatial Range Query (Rectangle)
     */
    rangeSearch(bounds, node = this.root, results = []) {
        if (!node) return results;

        const { point, axis, left, right } = node;
        const [lng, lat] = point.coordinates;

        // Normalize bounds: [minLng, minLat, maxLng, maxLat]
        const minLng = Math.min(bounds[0], bounds[2]);
        const minLat = Math.min(bounds[1], bounds[3]);
        const maxLng = Math.max(bounds[0], bounds[2]);
        const maxLat = Math.max(bounds[1], bounds[3]);
        const normalizedBounds = [minLng, minLat, maxLng, maxLat];

        // Check if current point is within bounds
        if (lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat) {
            results.push(point);
        }

        // Determine which subtrees to search
        const coord = point.coordinates[axis];
        const minBound = normalizedBounds[axis];
        const maxBound = normalizedBounds[axis + 2];

        if (minBound <= coord) {
            this.rangeSearch(normalizedBounds, left, results);
        }
        if (maxBound >= coord) {
            this.rangeSearch(normalizedBounds, right, results);
        }

        return results;
    }

    /**
     * Nearest Neighbor Query
     */
    nearestNeighbor(target, k = 1) {
        const results = []; // Max-heap would be better for k > 1, but using simple sorting for now
        this._nnSearch(this.root, target, k, results);
        return results.sort((a, b) => a.dist - b.dist).slice(0, k);
    }

    _nnSearch(node, target, k, results) {
        if (!node) return;

        const dist = this._distance(node.point.coordinates, target);

        if (results.length < k || dist < results[results.length - 1].dist) {
            results.push({ ...node.point, dist });
            results.sort((a, b) => a.dist - b.dist);
            if (results.length > k) results.pop();
        }

        const axis = node.axis;
        const diff = target[axis] - node.point.coordinates[axis];

        // Approximate distance to splitting plane for pruning.
        // For a more accurate pruning with Haversine, we'd need more complex logic,
        // but since diff is in degrees, this is a safe heuristic for pruning
        // if we convert it to an approximate meter distance.
        const planeDist = this._distanceToPlane(target, node.point.coordinates[axis], axis);

        const near = diff < 0 ? node.left : node.right;
        const far = diff < 0 ? node.right : node.left;

        this._nnSearch(near, target, k, results);

        if (results.length < k || planeDist < results[results.length - 1].dist) {
            this._nnSearch(far, target, k, results);
        }
    }

    _distance(p1, p2) {
        // Haversine distance in meters
        const R = 6371e3; // Earth radius in meters
        const φ1 = p1[1] * Math.PI / 180;
        const φ2 = p2[1] * Math.PI / 180;
        const Δφ = (p2[1] - p1[1]) * Math.PI / 180;
        const Δλ = (p2[0] - p1[0]) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    _distanceToPlane(target, splitCoord, axis) {
        // Simple approximation of distance to the plane for pruning
        if (axis === 1) { // Latitude split
            return Math.abs(target[1] - splitCoord) * 111320; // ~111km per degree
        } else { // Longitude split
            const latRad = target[1] * Math.PI / 180;
            return Math.abs(target[0] - splitCoord) * 111320 * Math.cos(latRad);
        }
    }

    getAllPoints(node = this.root, results = []) {
        if (!node) return results;
        results.push(node.point);
        this.getAllPoints(node.left, results);
        this.getAllPoints(node.right, results);
        return results;
    }
}

module.exports = KDTree;
