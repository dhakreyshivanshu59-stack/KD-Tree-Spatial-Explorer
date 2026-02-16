const points = [
    { name: 'Gateway of India, Mumbai', lat: 18.9220, lng: 72.8347 },
    { name: 'Red Fort, Delhi', lat: 28.6562, lng: 77.2410 },
    { name: 'Lalbagh Botanical Garden, Bangalore', lat: 12.9507, lng: 77.5848 },
    { name: 'Charminar, Hyderabad', lat: 17.3616, lng: 78.4747 },
    { name: 'Sabarmati Ashram, Ahmedabad', lat: 23.0605, lng: 72.5800 },
    { name: 'Marina Beach, Chennai', lat: 13.0494, lng: 80.2824 },
    { name: 'Victoria Memorial, Kolkata', lat: 22.5448, lng: 88.3426 },
    { name: 'Shaniwar Wada, Pune', lat: 18.5197, lng: 73.8553 },
    { name: 'Hawa Mahal, Jaipur', lat: 26.9239, lng: 75.8267 },
    { name: 'Dutch Garden, Surat', lat: 21.1960, lng: 72.8223 },
    { name: 'Taj Mahal, Agra', lat: 27.1751, lng: 78.0421 },
    { name: 'Golden Temple, Amritsar', lat: 31.6200, lng: 74.8765 },
    { name: 'Dashashwamedh Ghat, Varanasi', lat: 25.3176, lng: 83.0062 },
    { name: 'City Palace, Udaipur', lat: 24.5764, lng: 73.6835 },
    { name: 'Fort Kochi, Kochi', lat: 9.9658, lng: 76.2421 },
    { name: 'Mall Road, Shimla', lat: 31.1048, lng: 77.1734 },
    { name: 'Kamakhya Temple, Guwahati', lat: 26.1661, lng: 91.7061 },
    { name: 'Bara Imambara, Lucknow', lat: 26.8693, lng: 80.9125 },
    { name: 'Lingaraj Temple, Bhubaneswar', lat: 20.2382, lng: 85.8338 },
    { name: 'Golghar, Patna', lat: 25.6207, lng: 85.1311 },
    { name: 'Dal Lake, Srinagar', lat: 34.0837, lng: 74.7973 },
    { name: 'Miramar Beach, Panaji', lat: 15.4800, lng: 73.8100 },
    { name: 'Upper Lake, Bhopal', lat: 23.2500, lng: 77.4100 },
    { name: 'Pahari Mandir, Ranchi', lat: 23.3500, lng: 85.3300 },
    { name: 'Marine Drive, Raipur', lat: 21.2500, lng: 81.6300 }
];

function euclideanDist(p1, p2) {
    return Math.sqrt((p1.lng - p2.lng) ** 2 + (p1.lat - p2.lat) ** 2);
}

function haversineDist(p1, p2) {
    const R = 6371; // Earth radius in km
    const dLat = (p2.lat - p1.lat) * Math.PI / 180;
    const dLng = (p2.lng - p1.lng) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Result in meters
}

const target = { lat: 25, lng: 80 }; // Somewhere in central India

console.log('Target:', target);

const sortedEuclidean = [...points].sort((a, b) => euclideanDist(a, target) - euclideanDist(b, target));
const sortedHaversine = [...points].sort((a, b) => haversineDist(a, target) - haversineDist(b, target));

console.log('\nTop 5 Euclidean:');
sortedEuclidean.slice(0, 5).forEach(p => console.log(`${p.name} (${euclideanDist(p, target).toFixed(4)} deg)`));

console.log('\nTop 5 Haversine:');
sortedHaversine.slice(0, 5).forEach(p => console.log(`${p.name} (${(haversineDist(p, target) / 1000).toFixed(1)} km)`));

if (sortedEuclidean[0].name !== sortedHaversine[0].name) {
    console.log('\nDIFFERENCE FOUND in top 1!');
} else {
    console.log('\nTop 1 matches.');
}
