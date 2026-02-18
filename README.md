# 🌍 KD-Tree Spatial Query Handler

A high-performance location-based service backend that answers rectangle range and nearest-neighbor queries using an in-memory balanced KD-tree.

---

## ⚡ Quick Summary

**What is this?**
This project is a high-speed engine for finding locations on a map. It's built for applications like ride-sharing, food delivery, or real-time gaming where you need to find the closest points in milliseconds.

**Key Features:**
- 📐 **Range Search**: Find all points inside a specific rectangle on the map.
- 📍 **Nearest Neighbors (KNN)**: Find the `k` closest locations to any point using the **Haversine formula** for real-world accuracy.
- 🚀 **Blazing Fast**: Uses an **in-memory KD-Tree** index, making it significantly faster than standard database queries.
- 🔄 **Self-Balancing**: Includes tools to rebuild and re-balance the spatial index automatically from MongoDB.

**[📖 Read the Full Architecture Guide](./ARCHITECTURE.md)**

---

Built with **Node.js**, **Express**, **MongoDB**, and **Unix-style coordinate hashing**...

- **Express REST API** – endpoints for spatial range & nearest-neighbor queries.
- **Pure Node.js KD-Tree** – custom implementation, built from MongoDB data, always balanced (median split).
- **MongoDB Geospatial Persistence** – `2dsphere` index as source of truth & fallback.
- **Shell Script Maintenance** – one-command tree rebuild / rebalance.
- **Git-Tracked Index Versions** – pre-commit hook automatically records index hash in `data/index-version.json`.
- **Coordinate Hashing Acceleration** – Geohash (Unix style) used for fast indexing and lookups.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **API Layer** | Express.js |
| **KD-Tree** | Node.js (custom classes) |
| **Database** | MongoDB + Mongoose (`2dsphere` index) |
| **Scripting** | Bash + Node scripts |
| **Versioning** | Git hooks |
| **Hashing** | Geohash (via `ngeohash`) |

---

## 📋 Prerequisites

- Node.js 18+
- MongoDB 5+ (local or Atlas)
- Git (for hook installation)

---

---

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd project-root
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/spatialdb
   ```

4. **Initialize Database & Hooks**
   ```bash
   # Add sample data to MongoDB (Required for KD-tree to have points)
   npm run seed

   # Install spatial index versioning hooks
   node scripts/setup-hooks.js
   ```

---

## 🛠️ Commands Reference

| Command | Description |
|---|---|
| `npm start` | Start the Express server and build the KD-tree. |
| `npm run dev` | Start the server in development mode (auto-restart with nodemon). |
| `npm run seed` | Seed the database with sample New York locations. |
| `npm run seed:india` | Seed the database with sample India locations. |
| `npm test` | Run the test suite. |

---

## 🏃 Running the Server

To start the server and build the in-memory spatial index:
```bash
npm start
# OR for development (auto-restarts on file changes)
npm run dev
```

On startup, the system will:
1. Connect to MongoDB using `MONGODB_URI`.
2. Fetch all location documents.
3. Build a balanced KD-tree for fast spatial queries.
4. Listen for API requests on the configured `PORT`.

---

## 📡 API Usage

### 1. Rectangle (Range) Query
Find all points inside a bounding box.
`GET /api/spatial/range?minLng=-73.99&minLat=40.74&maxLng=-73.95&maxLat=40.78`

### 2. K-Nearest Neighbors
Find the `k` closest points to a given location.
`GET /api/spatial/nearest?lng=-73.985&lat=40.748&limit=5`

### 3. Rebuild Tree
Trigger a manual rebuild and rebalance.
`POST /api/spatial/rebuild`

---

## 🔧 Maintenance Scripts

| Command | Action |
|---|---|
| `./scripts/balance-tree.sh` | Trigger a tree rebalance via API. |
| `./scripts/update-index.sh` | Compute index hash and update `data/index-version.json`. |

> [!TIP]
> **Git Tracking**: The pre-commit hook automatically runs `./scripts/update-index.sh` to ensure every commit is linked to a specific spatial index state.

---

## 📁 Project Structure

```text
project-root/
├── src/
│   ├── kdtree/          # Core KD-tree logic
│   ├── models/          # Mongoose Location schema
│   ├── services/        # KD-tree singleton service
│   ├── controllers/     # API request handlers
│   └── utils/           # Geohash utilities
├── scripts/             # Shell maintenance scripts
├── data/                # Version-controlled index metadata
└── ...
```

---

## 📄 License
MIT
