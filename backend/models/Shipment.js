const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  origin: {
    type: String,
    required: [true, 'Please add an origin location']
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination location']
  },
  carrier: {
    type: String,
    required: [true, 'Please add a carrier']
  },
  trackingNumber: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['Pending', 'InTransit', 'Delivered', 'Delayed', 'Cancelled'],
    default: 'Pending'
  },
  estimatedDepartureDate: {
    type: Date,
    required: [true, 'Please add an estimated departure date']
  },
  actualDepartureDate: {
    type: Date
  },
  estimatedArrivalDate: {
    type: Date,
    required: [true, 'Please add an estimated arrival date']
  },
  actualArrivalDate: {
    type: Date
  },
  currentLocation: {
    type: String
  },
  locationUpdates: [{
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  documents: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Document'
  }],
  blockchainTxHash: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate tracking number if not provided
ShipmentSchema.pre('save', function(next) {
  if (!this.trackingNumber) {
    const randomPart = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    this.trackingNumber = `SHP${Date.now().toString().substring(7)}${randomPart}`;
  }
  next();
});

module.exports = mongoose.model('Shipment', ShipmentSchema); 