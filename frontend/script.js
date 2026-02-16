let map;
let markers = [];
let currentMode = 'all';
let selectedPoint = null;
let rangeRectangle = null;

// Initialize Map
function initMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5); // Center of India

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    map.on('click', onMapClick);

    // Initial load
    fetchLocations();
}

async function fetchLocations() {
    showOverlay();
    const startTime = performance.now();
    try {
        const response = await fetch('/api/spatial/all');
        const data = await response.json();
        const endTime = performance.now();

        clearMarkers();
        data.results.forEach(loc => addMarker(loc));

        document.getElementById('total-count').textContent = data.count.toLocaleString();
        document.getElementById('query-time').textContent = `${(endTime - startTime).toFixed(1)}ms`;
    } catch (err) {
        console.error('Error fetching locations:', err);
    } finally {
        hideOverlay();
    }
}

function addMarker(loc, isQueryMatch = false) {
    const icon = L.divIcon({
        className: `custom-marker ${isQueryMatch ? 'match' : ''}`,
        html: `<div class="marker-dot"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    const distanceHtml = loc.dist !== undefined
        ? `<div style="margin-top: 5px; color: var(--success); font-weight: 600">
             Distance: ${(loc.dist / 1000).toFixed(2)} km
           </div>`
        : '';

    const marker = L.marker([loc.coordinates[1], loc.coordinates[0]], { icon })
        .bindPopup(`
            <div class="popup-content">
                <h4 style="margin: 0 0 5px; color: var(--accent-color)">${loc.name}</h4>
                <div style="font-size: 11px; color: var(--text-secondary)">
                    <div>Lat: ${loc.coordinates[1].toFixed(6)}</div>
                    <div>Lng: ${loc.coordinates[0].toFixed(6)}</div>
                    <div style="margin-top: 5px; font-family: monospace">${loc.geohash}</div>
                    ${distanceHtml}
                </div>
            </div>
        `);

    marker.addTo(map);
    markers.push(marker);
}

function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    if (rangeRectangle) {
        map.removeLayer(rangeRectangle);
        rangeRectangle = null;
    }
}

function showOverlay() {
    document.getElementById('map-overlay').classList.remove('hidden');
}

function hideOverlay() {
    document.getElementById('map-overlay').classList.add('hidden');
}

// Event Handlers
function onMapClick(e) {
    if (currentMode === 'nearest') {
        document.getElementById('targetLat').value = e.latlng.lat.toFixed(6);
        document.getElementById('targetLng').value = e.latlng.lng.toFixed(6);

        // Visual indicator for target
        if (selectedPoint) map.removeLayer(selectedPoint);
        selectedPoint = L.circleMarker(e.latlng, {
            radius: 8,
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.5
        }).addTo(map);
    } else if (currentMode === 'range') {
        // Option to draw range would go here
    }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentMode = btn.dataset.mode;
        document.getElementById('range-inputs').classList.toggle('hidden', currentMode !== 'range');
        document.getElementById('nearest-inputs').classList.toggle('hidden', currentMode !== 'nearest');

        if (currentMode === 'all') fetchLocations();
    });
});

document.getElementById('run-range').addEventListener('click', async () => {
    const minLng = document.getElementById('minLng').value;
    const minLat = document.getElementById('minLat').value;
    const maxLng = document.getElementById('maxLng').value;
    const maxLat = document.getElementById('maxLat').value;

    if (!minLng || !minLat || !maxLng || !maxLat) return alert('Please enter all bounds');

    showOverlay();
    const startTime = performance.now();
    try {
        const response = await fetch(`/api/spatial/range?minLng=${minLng}&minLat=${minLat}&maxLng=${maxLng}&maxLat=${maxLat}`);
        const data = await response.json();
        const endTime = performance.now();

        clearMarkers();
        data.results.forEach(loc => addMarker(loc, true));

        rangeRectangle = L.rectangle([[minLat, minLng], [maxLat, maxLng]], {
            color: "#10b981",
            weight: 1,
            fillOpacity: 0.1
        }).addTo(map);

        document.getElementById('total-count').textContent = data.count.toLocaleString();
        document.getElementById('query-time').textContent = `${(endTime - startTime).toFixed(1)}ms`;
    } catch (err) {
        console.error('Range query failed:', err);
    } finally {
        hideOverlay();
    }
});

document.getElementById('run-nearest').addEventListener('click', async () => {
    const lng = document.getElementById('targetLng').value;
    const lat = document.getElementById('targetLat').value;
    const limit = document.getElementById('limit').value;

    if (!lng || !lat) return alert('Click on the map to set target point');

    showOverlay();
    const startTime = performance.now();
    try {
        const response = await fetch(`/api/spatial/nearest?lng=${lng}&lat=${lat}&limit=${limit}`);
        const data = await response.json();
        const endTime = performance.now();

        clearMarkers();
        data.results.forEach(loc => addMarker(loc, true));

        document.getElementById('total-count').textContent = data.count.toLocaleString();
        document.getElementById('query-time').textContent = `${(endTime - startTime).toFixed(1)}ms`;
    } catch (err) {
        console.error('Nearest search failed:', err);
    } finally {
        hideOverlay();
    }
});

document.getElementById('rebuild-btn').addEventListener('click', async () => {
    if (!confirm('Rebuild the KD-Tree? This will re-balance the tree from MongoDB data.')) return;

    showOverlay();
    try {
        const response = await fetch('/api/spatial/rebuild', { method: 'POST' });
        const data = await response.json();
        alert(`${data.message}. New count: ${data.count}`);
        fetchLocations();
    } catch (err) {
        alert('Rebuild failed');
    } finally {
        hideOverlay();
    }
});

initMap();
