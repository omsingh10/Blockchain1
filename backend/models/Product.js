const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  manufacturer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  blockchainId: {
    type: Number,
    unique: true
  },
  status: {
    type: String,
    enum: ['Created', 'InTransit', 'Delivered', 'Rejected'],
    default: 'Created'
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  sku: {
    type: String,
    trim: true,
    unique: true
  },
  batchNumber: {
    type: String,
    trim: true
  },
  manufactureDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  quantity: {
    type: Number,
    required: [true, 'Please add a quantity'],
    default: 1
  },
  unit: {
    type: String,
    default: 'piece'
  },
  images: [String],
  documents: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Document'
  }],
  shipments: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Shipment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create product slug from the name
ProductSchema.pre('save', function(next) {
  if (!this.sku) {
    // Generate SKU if not provided
    this.sku = `${this.name.substring(0, 3).toUpperCase()}-${Date.now().toString().substring(7)}`;
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema); 