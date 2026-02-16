#!/bin/bash
# Script to update index metadata for Git tracking
echo "Updating index metadata..."
MD5_HASH=$(curl -s http://localhost:3000/api/spatial/range?minLng=-180\&minLat=-90\&maxLng=180\&maxLat=90 | md5sum | awk '{print $1}')
echo "{\"version\": \"$(date +%Y%m%d%H%M%S)\", \"hash\": \"$MD5_HASH\"}" > data/index-version.json
echo "Index metadata updated in data/index-version.json"
