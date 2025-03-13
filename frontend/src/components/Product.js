import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import './Product.css';

// Mock data for a single product when Web3 is not initialized
const mockProductData = {
  1: {
    id: 1,
    name: 'Organic Apples',
    description: 'Fresh organic apples from local farms. These apples are grown without pesticides and are harvested at peak ripeness to ensure the best flavor and nutritional value.',
    price: '0.05',
    category: 'Food & Beverages',
    manufacturer: 'Green Farms Co.',
    manufacturerAddress: '0x1234...5678',
    status: 'SHIPPED',
    imageUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    createdAt: '2023-05-15T10:30:00Z',
    location: 'Washington, USA',
    owner: 'FreshMarket Distributors',
    ownerAddress: '0x8765...4321',
    documents: [
      { id: 1, name: 'Organic Certification', verified: true, date: '2023-05-10' },
      { id: 2, name: 'Quality Inspection Report', verified: true, date: '2023-05-12' },
      { id: 3, name: 'Shipping Manifest', verified: true, date: '2023-05-16' }
    ],
    history: [
      { date: '2023-05-15', status: 'CREATED', actor: 'Green Farms Co.', notes: 'Product added to blockchain' },
      { date: '2023-05-16', status: 'PROCESSING', actor: 'Green Farms Co.', notes: 'Product prepared for shipping' },
      { date: '2023-05-17', status: 'SHIPPED', actor: 'EcoLogistics Inc.', notes: 'Product shipped to distributor' }
    ]
  },
  2: {
    id: 2,
    name: 'Fair Trade Coffee',
    description: 'Ethically sourced coffee beans from small-scale farmers in Ethiopia. This coffee is shade-grown at high altitudes, resulting in a complex flavor profile with notes of blueberry, dark chocolate, and a hint of citrus.',
    price: '0.08',
    category: 'Food & Beverages',
    manufacturer: 'Mountain Coffee Ltd.',
    manufacturerAddress: '0xabcd...efgh',
    status: 'DELIVERED',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    createdAt: '2023-05-10T08:15:00Z',
    location: 'Yirgacheffe, Ethiopia',
    owner: 'Global Coffee Distributors',
    ownerAddress: 'oxijkl...mnop',
    documents: [
      { id: 1, name: 'Fair Trade Certification', verified: true, date: '2023-05-05' },
      { id: 2, name: 'Origin Verification', verified: true, date: '2023-05-07' },
      { id: 3, name: 'Quality Grading Report', verified: true, date: '2023-05-09' },
      { id: 4, name: 'Shipping Documents', verified: true, date: '2023-05-12' }
    ],
    history: [
      { date: '2023-05-10', status: 'CREATED', actor: 'Mountain Coffee Ltd.', notes: 'Beans harvested and processed' },
      { date: '2023-05-12', status: 'PROCESSING', actor: 'Mountain Coffee Ltd.', notes: 'Beans packaged for export' },
      { date: '2023-05-15', status: 'SHIPPED', actor: 'International Logistics Co.', notes: 'Shipped from Ethiopia' },
      { date: '2023-05-20', status: 'DELIVERED', actor: 'Global Coffee Distributors', notes: 'Received at warehouse' }
    ]
  }
};

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInitialized, getProduct, getDocuments, verifyDocument, createPayment } = useWeb3();
  const [product, setProduct] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [transactionStatus, setTransactionStatus] = useState({
    isProcessing: false,
    success: false,
    error: null,
    hash: null
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        
        if (isInitialized) {
          // Fetch product from blockchain
          try {
            const productData = await getProduct(id);
            setProduct(productData);
            
            // Fetch documents for the product
            const docsData = await getDocuments(id);
            setDocuments(docsData);
          } catch (error) {
            console.error('Error fetching blockchain product:', error);
            // Fallback to mock data if blockchain fetch fails
            const mockProduct = mockProductData[id];
            if (!mockProduct) {
              throw new Error('Product not found');
            }
            setProduct(mockProduct);
            setDocuments(mockProduct.documents);
          }
        } else {
          // Use mock data if Web3 is not initialized
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockProduct = mockProductData[id];
          if (!mockProduct) {
            throw new Error('Product not found');
          }
          
          setProduct(mockProduct);
          setDocuments(mockProduct.documents);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message || 'Failed to load product. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id, isInitialized, getProduct, getDocuments]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePurchase = async () => {
    if (!isInitialized) {
      alert('Please connect your wallet to make a purchase');
      return;
    }
    
    try {
      setTransactionStatus({
        isProcessing: true,
        success: false,
        error: null,
        hash: null
      });
      
      // Call the createPayment function from Web3Context
      const result = await createPayment(product.id, product.price);
      
      setTransactionStatus({
        isProcessing: false,
        success: true,
        error: null,
        hash: result.transactionHash
      });
      
      alert(`Payment initiated successfully! Transaction hash: ${result.transactionHash}`);
    } catch (error) {
      console.error('Error creating payment:', error);
      
      setTransactionStatus({
        isProcessing: false,
        success: false,
        error: error.message || 'Failed to create payment',
        hash: null
      });
      
      alert(`Failed to create payment: ${error.message}`);
    }
  };

  const handleVerifyDocument = async (documentId) => {
    if (!isInitialized) {
      alert('Please connect your wallet to verify documents');
      return;
    }
    
    try {
      setTransactionStatus({
        isProcessing: true,
        success: false,
        error: null,
        hash: null
      });
      
      // Call the verifyDocument function from Web3Context
      const result = await verifyDocument(documentId);
      
      setTransactionStatus({
        isProcessing: false,
        success: true,
        error: null,
        hash: result.transactionHash
      });
      
      // Update the document status in the UI
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === documentId ? { ...doc, verified: true } : doc
        )
      );
      
      alert(`Document verified successfully! Transaction hash: ${result.transactionHash}`);
    } catch (error) {
      console.error('Error verifying document:', error);
      
      setTransactionStatus({
        isProcessing: false,
        success: false,
        error: error.message || 'Failed to verify document',
        hash: null
      });
      
      alert(`Failed to verify document: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return (
      <div className="product-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/products')} className="btn secondary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-header">
        <Link to="/products" className="back-link">
          &larr; Back to Products
        </Link>
        <div className="product-actions">
          <button className="btn secondary">Share</button>
          <button 
            className="btn primary" 
            onClick={handlePurchase}
            disabled={transactionStatus.isProcessing || !isInitialized}
          >
            {transactionStatus.isProcessing ? 'Processing...' : 'Purchase'}
          </button>
        </div>
      </div>
      
      {!isInitialized && (
        <div className="alert alert-warning">
          <p>Connect your wallet to interact with this product on the blockchain.</p>
          <p>Currently showing mock data.</p>
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
      
      <div className="product-detail-content">
        <div className="product-detail-main">
          <div className="product-detail-image">
            <img src={product.imageUrl} alt={product.name} />
            <span className={`status-badge status-${product.status.toLowerCase()}`}>
              {product.status}
            </span>
          </div>
          
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <div className="product-meta">
              <span className="product-price">{product.price} ETH</span>
              <span className="product-category">{product.category}</span>
            </div>
            <p className="product-description">{product.description}</p>
            
            <div className="product-attributes">
              <div className="attribute">
                <span className="attribute-label">Manufacturer:</span>
                <span className="attribute-value">{product.manufacturer}</span>
              </div>
              <div className="attribute">
                <span className="attribute-label">Origin:</span>
                <span className="attribute-value">{product.location}</span>
              </div>
              <div className="attribute">
                <span className="attribute-label">Current Owner:</span>
                <span className="attribute-value">{product.owner}</span>
              </div>
              <div className="attribute">
                <span className="attribute-label">Created:</span>
                <span className="attribute-value">{formatDate(product.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="product-detail-tabs">
          <button 
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button 
            className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
        </div>
        
        <div className="product-detail-tab-content">
          {activeTab === 'details' && (
            <div className="tab-pane">
              <h2>Product Details</h2>
              <div className="blockchain-details">
                <div className="detail-item">
                  <span className="detail-label">Product ID:</span>
                  <span className="detail-value">{product.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Manufacturer Address:</span>
                  <span className="detail-value">{product.manufacturerAddress}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Current Owner Address:</span>
                  <span className="detail-value">{product.ownerAddress}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Current Status:</span>
                  <span className={`detail-value status-text status-${product.status.toLowerCase()}`}>
                    {product.status}
                  </span>
                </div>
              </div>
              
              <div className="qr-section">
                <h3>Scan to Verify Authenticity</h3>
                <div className="qr-placeholder">
                  <div className="qr-code">QR</div>
                  <p>Scan this QR code to verify this product's authenticity on the blockchain</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="tab-pane">
              <h2>Product History</h2>
              <div className="timeline">
                {product.history && product.history.map((event, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-date">{event.date}</div>
                      <div className="timeline-title">
                        <span className={`status-indicator status-${event.status.toLowerCase()}`}></span>
                        {event.status}
                      </div>
                      <div className="timeline-actor">By: {event.actor}</div>
                      <div className="timeline-notes">{event.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div className="tab-pane">
              <h2>Product Documents</h2>
              <div className="documents-list">
                {documents && documents.map(doc => (
                  <div key={doc.id} className="document-item">
                    <div className="document-icon">📄</div>
                    <div className="document-info">
                      <div className="document-name">{doc.name}</div>
                      <div className="document-date">Added: {doc.date}</div>
                    </div>
                    <div className="document-status">
                      {doc.verified ? (
                        <span className="verified">✓ Verified</span>
                      ) : (
                        <button 
                          className="verify-button"
                          onClick={() => handleVerifyDocument(doc.id)}
                          disabled={transactionStatus.isProcessing || !isInitialized}
                        >
                          {transactionStatus.isProcessing ? 'Verifying...' : 'Verify'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="document-upload">
                <h3>Add New Document</h3>
                <p>Upload additional documentation for this product</p>
                <button 
                  className="btn secondary"
                  disabled={!isInitialized}
                >
                  Upload Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product; 