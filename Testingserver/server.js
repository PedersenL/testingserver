// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/testingdb';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a simple data schema
const DataSchema = new mongoose.Schema({
  name: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Data = mongoose.model('Data', DataSchema);

// API Routes
// GET - Fetch all data
app.get('/api/data', async (req, res) => {
  try {
    const allData = await Data.find().sort({ createdAt: -1 });
    res.json(allData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Add new data
app.post('/api/data', async (req, res) => {
  try {
    const { name, message } = req.body;
    const newData = new Data({ name, message });
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Serve the frontend for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});