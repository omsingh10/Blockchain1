const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus
} = require('../controllers/products');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin', 'manufacturer'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin', 'manufacturer'), updateProduct)
  .delete(protect, authorize('admin', 'manufacturer'), deleteProduct);

router
  .route('/:id/status')
  .put(
    protect,
    authorize('admin', 'manufacturer', 'distributor', 'retailer'),
    updateProductStatus
  );

module.exports = router; 