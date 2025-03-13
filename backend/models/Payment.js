const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  payer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  payee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  currency: {
    type: String,
    default: 'ETH'
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Refunded', 'Disputed', 'Failed'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Crypto', 'Escrow', 'Bank Transfer', 'Credit Card', 'Other'],
    default: 'Crypto'
  },
  transactionHash: {
    type: String
  },
  blockchainId: {
    type: Number
  },
  paymentDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  documents: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Document'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', PaymentSchema); 