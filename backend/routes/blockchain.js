const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Temporary placeholder controller functions
// In a real implementation, these would be imported from a controller file
const {
  getBlockchainInfo,
  syncProduct,
  syncDocument,
  syncPayment
} = {
  getBlockchainInfo: (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Get blockchain info route',
      data: {
        networkId: 1337,
        blockNumber: 12345,
        gasPrice: '20000000000'
      }
    });
  },
  syncProduct: (req, res) => {
    res.status(200).json({
      success: true,
      message: `Sync product with id ${req.params.id} to blockchain`
    });
  },
  syncDocument: (req, res) => {
    res.status(200).json({
      success: true,
      message: `Sync document with id ${req.params.id} to blockchain`
    });
  },
  syncPayment: (req, res) => {
    res.status(200).json({
      success: true,
      message: `Sync payment with id ${req.params.id} to blockchain`
    });
  }
};

// Routes
router.get('/info', protect, getBlockchainInfo);

router.post('/products/:id/sync', 
  protect, 
  authorize('admin', 'manufacturer'), 
  syncProduct
);

router.post('/documents/:id/sync', 
  protect, 
  authorize('admin', 'manufacturer'), 
  syncDocument
);

router.post('/payments/:id/sync', 
  protect, 
  authorize('admin'), 
  syncPayment
);

module.exports = router; 