const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a document name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  documentType: {
    type: String,
    required: [true, 'Please add a document type'],
    enum: [
      'Certificate of Origin',
      'Quality Inspection',
      'Customs Declaration',
      'Bill of Lading',
      'Invoice',
      'Packing List',
      'Insurance Certificate',
      'Phytosanitary Certificate',
      'Other'
    ]
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  shipment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Shipment'
  },
  fileUrl: {
    type: String
  },
  fileHash: {
    type: String,
    required: [true, 'Please add a file hash']
  },
  blockchainId: {
    type: Number
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  verificationDate: {
    type: Date
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  issuedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// A document must be associated with either a product or a shipment
DocumentSchema.pre('save', function(next) {
  if (!this.product && !this.shipment) {
    return next(new Error('Document must be associated with either a product or a shipment'));
  }
  next();
});

module.exports = mongoose.model('Document', DocumentSchema); 