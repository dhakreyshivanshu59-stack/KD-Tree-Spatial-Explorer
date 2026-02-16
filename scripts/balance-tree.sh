#!/bin/bash
# Script to rebuild and balance the KD-tree by hitting the API endpoint
echo "Balancing KD-Tree..."
curl -X POST http://localhost:3000/api/spatial/rebuild
echo -e "\nTree balanced."
