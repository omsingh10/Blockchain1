import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Mock data for dashboard
const mockUserData = {
  name: 'John Smith',
  email: 'john@example.com',
  role: 'Manufacturer',
  walletAddress: '0x1234...5678',
  joinDate: 'January 15, 2023'
};

const mockProducts = [
  {
    id: 1,
    name: 'Organic Apples',
    status: 'SHIPPED',
    lastUpdated: 'Today, 10:30 AM'
  },
  {
    id: 2,
    name: 'Fair Trade Coffee',
    status: 'DELIVERED',
    lastUpdated: 'Yesterday, 3:45 PM'
  }
];

const mockTransactions = [
  {
    id: 'tx1',
    type: 'Payment',
    amount: '0.05 ETH',
    status: 'Completed',
    date: 'Today, 9:15 AM'
  },
  {
    id: 'tx2',
    type: 'Escrow',
    amount: '0.1 ETH',
    status: 'Pending',
    date: 'Yesterday, 2:30 PM'
  }
];

const mockNotifications = [
  {
    id: 'n1',
    message: 'Your product "Organic Apples" has been shipped',
    time: '2 hours ago',
    isRead: false
  },
  {
    id: 'n2',
    message: 'Payment received for "Fair Trade Coffee"',
    time: '1 day ago',
    isRead: true
  },
  {
    id: 'n3',
    message: 'New document verification request',
    time: '2 days ago',
    isRead: true
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Fetch user data, products, transactions, and notifications
    const fetchData = async () => {
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUserData(mockUserData);
        setProducts(mockProducts);
        setTransactions(mockTransactions);
        setNotifications(mockNotifications);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  if (isLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="user-profile">
          <div className="user-avatar">
            {userData.name.charAt(0)}
          </div>
          <div className="user-info">
            <h3>{userData.name}</h3>
            <p>{userData.role}</p>
          </div>
        </div>
        
        <nav className="dashboard-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            My Products
          </button>
          <button
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
        
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'products' && 'My Products'}
            {activeTab === 'transactions' && 'Transactions'}
            {activeTab === 'documents' && 'Documents'}
            {activeTab === 'settings' && 'Account Settings'}
          </h1>
          
          <div className="notifications-dropdown">
            <button className="notifications-button">
              <span className="notifications-icon">🔔</span>
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="notifications-badge">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </button>
            
            <div className="notifications-menu">
              <h3>Notifications</h3>
              {notifications.length === 0 ? (
                <p className="no-notifications">No notifications</p>
              ) : (
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <h3>Products</h3>
                <div className="card-value">{products.length}</div>
                <Link to="/products" className="card-link">View all products</Link>
              </div>
              
              <div className="dashboard-card">
                <h3>Transactions</h3>
                <div className="card-value">{transactions.length}</div>
                <button 
                  className="card-link"
                  onClick={() => setActiveTab('transactions')}
                >
                  View all transactions
                </button>
              </div>
              
              <div className="dashboard-card">
                <h3>Wallet Balance</h3>
                <div className="card-value">1.25 ETH</div>
                <button className="card-link">View wallet</button>
              </div>
            </div>
            
            <div className="recent-activity">
              <h2>Recent Activity</h2>
              
              <div className="activity-list">
                {products.map(product => (
                  <div key={product.id} className="activity-item">
                    <div className="activity-icon product-icon">📦</div>
                    <div className="activity-details">
                      <h4>{product.name}</h4>
                      <p>Status: {product.status}</p>
                      <span className="activity-time">{product.lastUpdated}</span>
                    </div>
                    <Link to={`/product/${product.id}`} className="activity-action">
                      View
                    </Link>
                  </div>
                ))}
                
                {transactions.map(transaction => (
                  <div key={transaction.id} className="activity-item">
                    <div className="activity-icon transaction-icon">💰</div>
                    <div className="activity-details">
                      <h4>{transaction.type}</h4>
                      <p>Amount: {transaction.amount}</p>
                      <span className="activity-time">{transaction.date}</span>
                    </div>
                    <button className="activity-action">Details</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h2>My Products</h2>
              <Link to="/add-product" className="add-button">
                + Add New Product
              </Link>
            </div>
            
            {products.length === 0 ? (
              <div className="empty-state">
                <p>You haven't added any products yet.</p>
                <Link to="/add-product" className="btn primary">
                  Add Your First Product
                </Link>
              </div>
            ) : (
              <div className="products-list">
                {products.map(product => (
                  <div key={product.id} className="product-item">
                    <h3>{product.name}</h3>
                    <div className="product-meta">
                      <span className={`status status-${product.status.toLowerCase()}`}>
                        {product.status}
                      </span>
                      <span className="last-updated">
                        Last updated: {product.lastUpdated}
                      </span>
                    </div>
                    <div className="product-actions">
                      <Link to={`/product/${product.id}`} className="btn secondary">
                        View Details
                      </Link>
                      <button className="btn primary">Update Status</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'transactions' && (
          <div className="transactions-section">
            <h2>Transaction History</h2>
            
            {transactions.length === 0 ? (
              <div className="empty-state">
                <p>No transactions found.</p>
              </div>
            ) : (
              <div className="transactions-table">
                <div className="table-header">
                  <div className="table-cell">Type</div>
                  <div className="table-cell">Amount</div>
                  <div className="table-cell">Status</div>
                  <div className="table-cell">Date</div>
                  <div className="table-cell">Actions</div>
                </div>
                
                {transactions.map(transaction => (
                  <div key={transaction.id} className="table-row">
                    <div className="table-cell">{transaction.type}</div>
                    <div className="table-cell">{transaction.amount}</div>
                    <div className="table-cell">
                      <span className={`status ${transaction.status.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="table-cell">{transaction.date}</div>
                    <div className="table-cell">
                      <button className="btn small">View</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div className="documents-section">
            <div className="section-header">
              <h2>Documents</h2>
              <button className="add-button">
                + Add New Document
              </button>
            </div>
            
            <div className="empty-state">
              <p>No documents found. Add documents for verification.</p>
              <button className="btn primary">Upload Document</button>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2>Account Settings</h2>
            
            <div className="settings-card">
              <h3>Profile Information</h3>
              
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={userData.name} readOnly />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={userData.email} readOnly />
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <input type="text" value={userData.role} readOnly />
              </div>
              
              <div className="form-group">
                <label>Wallet Address</label>
                <input type="text" value={userData.walletAddress} readOnly />
              </div>
              
              <div className="form-group">
                <label>Member Since</label>
                <input type="text" value={userData.joinDate} readOnly />
              </div>
              
              <button className="btn primary">Edit Profile</button>
            </div>
            
            <div className="settings-card">
              <h3>Security</h3>
              <button className="btn secondary">Change Password</button>
              <button className="btn secondary">Two-Factor Authentication</button>
            </div>
            
            <div className="settings-card">
              <h3>Connected Wallets</h3>
              <div className="wallet-item">
                <div className="wallet-info">
                  <span className="wallet-name">MetaMask</span>
                  <span className="wallet-address">{userData.walletAddress}</span>
                </div>
                <span className="wallet-status connected">Connected</span>
              </div>
              <button className="btn secondary">Connect Another Wallet</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 