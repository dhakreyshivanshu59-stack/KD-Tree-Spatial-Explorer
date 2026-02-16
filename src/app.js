const express = require('express');
const morgan = require('morgan');
const spatialRoutes = require('./routes/spatialRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/spatial', spatialRoutes);
app.use(express.static('frontend'));

// app.get('/', (req, res) => {
//     res.json({ message: 'KD-Tree Spatial Query Handler API is running' });
// });

module.exports = app;
