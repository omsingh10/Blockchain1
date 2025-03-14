import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: 'Organic Apples',
    description: 'Fresh organic apples from local farms',
    price: '0.05 ETH',
    category: 'Food & Beverages',
    manufacturer: 'Green Farms Co.',
    status: 'SHIPPED',
    imageUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    name: 'Fair Trade Coffee',
    description: 'Ethically sourced coffee beans',
    price: '0.08 ETH',
    category: 'Food & Beverages',
    manufacturer: 'Mountain Coffee Ltd.',
    status: 'DELIVERED',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    name: 'Eco-Friendly T-Shirt',
    description: 'Made from 100% recycled materials',
    price: '0.15 ETH',
    category: 'Clothing & Textiles',
    manufacturer: 'Green Threads Inc.',
    status: 'PROCESSING',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 4,
    name: 'Organic Honey',
    description: 'Pure honey from sustainable apiaries',
    price: '0.03 ETH',
    category: 'Food & Beverages',
    manufacturer: 'Bee Natural Co.',
    status: 'AVAILABLE',
    imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 5,
    name: 'Solar Power Bank',
    description: 'Portable charger with solar panels',
    price: '0.25 ETH',
    category: 'Electronics',
    manufacturer: 'EcoTech Solutions',
    status: 'AVAILABLE',
    imageUrl: 'https://images.unsplash.com/photo-1594131431617-93836b3c8f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    searchTerm: ''
  });

  useEffect(() => {
    // In a real app, this would fetch products from your blockchain service
    const fetchProducts = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(mockProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const filteredProducts = products.filter(product => {
    // Filter by category
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    // Filter by status
    if (filters.status && product.status !== filters.status) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm && !product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  if (isLoading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Supply Chain Products</h1>
        <Link to="/add-product" className="add-product-btn">
          + Add New Product
        </Link>
      </div>
      
      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            placeholder="Search products..."
          />
        </div>
        
        <div className="filter-options">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="Food & Beverages">Food & Beverages</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing & Textiles">Clothing & Textiles</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Raw Materials">Raw Materials</option>
          </select>
          
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
                <span className={`status-badge status-${product.status.toLowerCase()}`}>
                  {product.status}
                </span>
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <span className="product-price">{product.price}</span>
                  <span className="product-category">{product.category}</span>
                </div>
                <p className="product-manufacturer">By: {product.manufacturer}</p>
                <Link to={`/product/${product.id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList; 