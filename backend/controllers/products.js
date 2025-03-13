const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Product.find(JSON.parse(queryStr)).populate({
    path: 'manufacturer',
    select: 'name company'
  });

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const products = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: 'manufacturer',
      select: 'name company'
    })
    .populate('documents')
    .populate('shipments');

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.manufacturer = req.user.id;

  // Check if user is a manufacturer
  if (req.user.role !== 'manufacturer' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to create a product`,
        403
      )
    );
  }

  // Create product in database
  const product = await Product.create(req.body);

  // Create product on blockchain
  try {
    const web3 = req.web3;
    const SupplyChainContract = require('../utils/contracts/SupplyChain');
    const supplyChainContract = new web3.eth.Contract(
      SupplyChainContract.abi,
      process.env.SUPPLY_CHAIN_CONTRACT_ADDRESS
    );

    const accounts = await web3.eth.getAccounts();
    const result = await supplyChainContract.methods
      .createProduct(
        product.name,
        product.description,
        web3.utils.toWei(product.price.toString(), 'ether')
      )
      .send({ from: accounts[0], gas: 3000000 });

    // Update product with blockchain ID
    product.blockchainId = result.events.ProductCreated.returnValues.productId;
    await product.save();
  } catch (err) {
    console.error('Blockchain error:', err);
    // Continue even if blockchain fails - we'll sync later
  }

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is product owner or admin
  if (
    product.manufacturer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this product`,
        401
      )
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is product owner or admin
  if (
    product.manufacturer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this product`,
        401
      )
    );
  }

  await product.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update product status
// @route   PUT /api/products/:id/status
// @access  Private
exports.updateProductStatus = asyncHandler(async (req, res, next) => {
  const { status, location, notes } = req.body;

  if (!status || !location) {
    return next(new ErrorResponse('Please provide status and location', 400));
  }

  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Update product status in database
  product.status = status;
  await product.save();

  // Update product status on blockchain
  try {
    const web3 = req.web3;
    const SupplyChainContract = require('../utils/contracts/SupplyChain');
    const supplyChainContract = new web3.eth.Contract(
      SupplyChainContract.abi,
      process.env.SUPPLY_CHAIN_CONTRACT_ADDRESS
    );

    const accounts = await web3.eth.getAccounts();
    await supplyChainContract.methods
      .addShipmentUpdate(
        product.blockchainId,
        location,
        notes || 'Status update',
        getBlockchainStatus(status)
      )
      .send({ from: accounts[0], gas: 3000000 });
  } catch (err) {
    console.error('Blockchain error:', err);
    // Continue even if blockchain fails
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// Helper function to convert status to blockchain enum
function getBlockchainStatus(status) {
  switch (status) {
    case 'Created':
      return 0;
    case 'InTransit':
      return 1;
    case 'Delivered':
      return 2;
    case 'Rejected':
      return 3;
    default:
      return 0;
  }
} 