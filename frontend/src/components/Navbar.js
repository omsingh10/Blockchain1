import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isInitialized, isConnecting, account, error, connectWallet } = useWeb3();
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🔗</span>
          BlockchainSupplyChain
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}>
            {isMenuOpen ? '✕' : '☰'}
          </i>
        </div>
        
        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
          <li className="nav-item wallet-item">
            {account ? (
              <div className="wallet-connected">
                <span className="wallet-indicator connected"></span>
                <span className="wallet-address">{formatAddress(account)}</span>
              </div>
            ) : (
              <button 
                className="connect-wallet-btn" 
                onClick={handleConnectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 