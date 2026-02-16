const KDTree = require('./src/kdtree/KDTree');

const points = [
    { id: 1, coordinates: [10, 10], name: 'A' },
    { id: 2, coordinates: [20, 20], name: 'B' },
    { id: 3, coordinates: [30, 30], name: 'C' },
    { id: 4, coordinates: [15, 15], name: 'D' },
    { id: 5, coordinates: [25, 25], name: 'E' }
];

const tree = new KDTree(points);

function linearSearch(target, k) {
    const dist = (p1, p2) => Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
    return points
        .map(p => ({ ...p, dist: dist(p.coordinates, target) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, k);
}

const targets = [
    [12, 12],
    [22, 22],
    [5, 5],
    [35, 35],
    [20, 10]
];

targets.forEach(target => {
    console.log(`\nTarget: ${target}`);
    const expected = linearSearch(target, 1);
    const actual = tree.nearestNeighbor(target, 1);

    console.log(`Expected: ${expected[0].name} (dist: ${expected[0].dist.toFixed(4)})`);
    console.log(`Actual:   ${actual[0].name} (dist: ${actual[0].dist.toFixed(4)})`);

    if (expected[0].id !== actual[0].id) {
        console.error('FAILED!');
    } else {
        console.log('PASSED');
    }
});

// Test with k=3
console.log('\nTesting with k=3 at [21, 21]');
const targetK = [21, 21];
const expectedK = linearSearch(targetK, 3);
const actualK = tree.nearestNeighbor(targetK, 3);

console.log('Expected:', expectedK.map(p => p.name).join(', '));
console.log('Actual:  ', actualK.map(p => p.name).join(', '));

const expectedIds = expectedK.map(p => p.id).sort();
const actualIds = actualK.map(p => p.id).sort();

if (JSON.stringify(expectedIds) === JSON.stringify(actualIds)) {
    console.log('PASSED');
} else {
    console.error('FAILED!');
}
