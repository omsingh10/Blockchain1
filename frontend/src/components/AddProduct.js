import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import './AddProduct.css';

// In a real app, this would be imported from your web3 service
// import { supplyChainService } from '../services/web3Service';

const AddProduct = () => {
  const navigate = useNavigate();
  const { isInitialized, addProduct } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    location: '',
    imageUrl: ''
  });
  const [transactionStatus, setTransactionStatus] = useState({
    isProcessing: false,
    success: false,
    error: null,
    hash: null
  });

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('Product description is required');
      return false;
    }
    
    if (!formData.price.trim()) {
      setError('Product price is required');
      return false;
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setError('Price must be a positive number');
      return false;
    }
    
    if (!formData.category.trim()) {
      setError('Product category is required');
      return false;
    }
    
    if (!formData.location.trim()) {
      setError('Product location is required');
      return false;
    }
    
    if (!formData.imageUrl.trim()) {
      setError('Product image URL is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isInitialized) {
      setError('Please connect your wallet to add a product');
      return;
    }
    
    if (validateForm()) {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      try {
        setTransactionStatus({
          isProcessing: true,
          success: false,
          error: null,
          hash: null
        });
        
        // Call the addProduct function from Web3Context
        const result = await addProduct(formData);
        
        setTransactionStatus({
          isProcessing: false,
          success: true,
          error: null,
          hash: result.transactionHash
        });
        
        setSuccess(`Product "${formData.name}" has been successfully added to the blockchain!`);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          location: '',
          imageUrl: ''
        });
        
        // Redirect to product page after a delay
        setTimeout(() => {
          navigate(`/product/${result.productId}`);
        }, 3000);
      } catch (error) {
        console.error('Error adding product:', error);
        
        setTransactionStatus({
          isProcessing: false,
          success: false,
          error: error.message || 'Failed to add product',
          hash: null
        });
        
        setError(error.message || 'Failed to add product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <h2>Add New Product</h2>
        <p className="subtitle">Add a new product to the blockchain supply chain</p>
        
        {!isInitialized && (
          <div className="alert alert-warning">
            <p>Connect your wallet to add products to the blockchain.</p>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <p>{success}</p>
          </div>
        )}
        
        {transactionStatus.success && (
          <div className="alert alert-success">
            <p>Transaction successful!</p>
            <p>Transaction hash: <span className="tx-hash">{transactionStatus.hash}</span></p>
          </div>
        )}
        
        {transactionStatus.error && (
          <div className="alert alert-danger">
            <p>Transaction failed: {transactionStatus.error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              disabled={isLoading || transactionStatus.isProcessing}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
              disabled={isLoading || transactionStatus.isProcessing}
            ></textarea>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (ETH)</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                disabled={isLoading || transactionStatus.isProcessing}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isLoading || transactionStatus.isProcessing}
              >
                <option value="">Select a category</option>
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing & Apparel">Clothing & Apparel</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Automotive">Automotive</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Origin Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter product origin location"
              disabled={isLoading || transactionStatus.isProcessing}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Enter product image URL"
              disabled={isLoading || transactionStatus.isProcessing}
            />
          </div>
          
          <div className="blockchain-note">
            <p>
              <strong>Note:</strong> Adding a product will create a transaction on the blockchain.
              This requires a connected wallet and may incur gas fees.
            </p>
          </div>
          
          <div className="form-buttons">
            <button
              type="button"
              className="btn secondary"
              onClick={handleCancel}
              disabled={isLoading || transactionStatus.isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn primary"
              disabled={isLoading || transactionStatus.isProcessing || !isInitialized}
            >
              {isLoading || transactionStatus.isProcessing ? 'Processing...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct; 