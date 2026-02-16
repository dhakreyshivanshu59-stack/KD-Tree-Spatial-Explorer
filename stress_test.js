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

const n = 1000;
const points = generatePoints(n);
const tree = new KDTree(points);

function linearSearch(target, k) {
    const dist = (p1, p2) => Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
    return points
        .map(p => ({ ...p, dist: dist(p.coordinates, target) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, k);
}

const numTests = 100;
let passed = 0;

for (let i = 0; i < numTests; i++) {
    const target = [Math.random() * 360 - 180, Math.random() * 180 - 90];
    const k = Math.floor(Math.random() * 10) + 1;

    const expected = linearSearch(target, k);
    const actual = tree.nearestNeighbor(target, k);

    const expectedIds = expected.map(p => p.id).sort().join(',');
    const actualIds = actual.map(p => p.id).sort().join(',');

    if (expectedIds === actualIds) {
        passed++;
    } else {
        console.error(`Test ${i} FAILED for k=${k} at ${target}`);
        console.log('Expected IDs:', expectedIds);
        console.log('Actual IDs:  ', actualIds);
        // Break on first failure to investigate
        break;
    }
}

console.log(`\nPassed ${passed}/${numTests} randomized tests.`);
