const KDTree = require('./src/kdtree/KDTree');

function generatePoints(n) {
    const points = [];
    for (let i = 0; i < n; i++) {
        points.push({
            id: i,
            coordinates: [Math.random() * 360 - 180, Math.random() * 180 - 90],
            name: `Point-${i}`
        });
    }
    return points;
}

function haversineDist(p1, p2) {
    const R = 6371e3;
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

const n = 1000;
const points = generatePoints(n);
const tree = new KDTree(points);

function linearSearch(target, k) {
    return points
        .map(p => ({ ...p, dist: haversineDist(p.coordinates, target) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, k);
}

// Test NN Search
const numTests = 100;
let passedNN = 0;
for (let i = 0; i < numTests; i++) {
    const target = [Math.random() * 360 - 180, Math.random() * 180 - 90];
    const k = Math.floor(Math.random() * 5) + 1;

    const expected = linearSearch(target, k);
    const actual = tree.nearestNeighbor(target, k);

    const expectedIds = expected.map(p => p.id).sort().join(',');
    const actualIds = actual.map(p => p.id).sort().join(',');

    if (expectedIds === actualIds) {
        passedNN++;
    } else {
        console.error(`NN Test ${i} FAILED for k=${k}`);
    }
}
console.log(`\nNN Search: Passed ${passedNN}/${numTests} tests.`);

// Test Swapped Bounds
const bounds = [10, 10, -10, -10]; // Swapped
const resultsNormal = tree.rangeSearch([-10, -10, 10, 10]);
const resultsSwapped = tree.rangeSearch(bounds);

if (resultsNormal.length === resultsSwapped.length && resultsNormal.length > 0) {
    console.log('Range Search Bounds Normalization: PASSED');
} else if (resultsNormal.length === 0) {
    console.log('Range Search Bounds Normalization: SKIPPED (no points in range)');
} else {
    console.error('Range Search Bounds Normalization: FAILED');
}
