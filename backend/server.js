const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const Web3 = require('web3');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const shipmentRoutes = require('./routes/shipments');
const documentRoutes = require('./routes/documents');
const paymentRoutes = require('./routes/payments');
const blockchainRoutes = require('./routes/blockchain');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supply-chain-blockchain', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Initialize Web3
const web3 = new Web3(process.env.BLOCKCHAIN_PROVIDER || 'http://localhost:8545');

// Make Web3 available in routes
app.use((req, res, next) => {
  req.web3 = web3;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Supply Chain Blockchain API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 