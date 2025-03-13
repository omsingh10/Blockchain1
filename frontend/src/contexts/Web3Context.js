import React, { createContext, useState, useEffect, useContext } from 'react';
import web3Service from '../services/Web3Service';

// Create context
const Web3Context = createContext();

// Provider component
export const Web3Provider = ({ children }) => {
  const [web3State, setWeb3State] = useState({
    isInitialized: false,
    isConnecting: false,
    account: null,
    networkId: null,
    error: null
  });

  // Initialize Web3 on component mount
  useEffect(() => {
    const initializeWeb3 = async () => {
      setWeb3State(prevState => ({ ...prevState, isConnecting: true }));
      
      try {
        const result = await web3Service.initWeb3();
        
        if (result.success) {
          setWeb3State({
            isInitialized: true,
            isConnecting: false,
            account: result.account,
            networkId: result.networkId,
            error: null
          });
        } else {
          setWeb3State({
            isInitialized: false,
            isConnecting: false,
            account: null,
            networkId: null,
            error: result.error
          });
        }
      } catch (error) {
        setWeb3State({
          isInitialized: false,
          isConnecting: false,
          account: null,
          networkId: null,
          error: error.message || 'Failed to initialize Web3'
        });
      }
    };

    initializeWeb3();
    
    // Setup event listeners for account changes
    web3Service.on('accountsChanged', (accounts) => {
      setWeb3State(prevState => ({
        ...prevState,
        account: accounts[0] || null
      }));
    });
    
    // No cleanup needed for the web3Service singleton
  }, []);

  // Connect to MetaMask
  const connectWallet = async () => {
    setWeb3State(prevState => ({ ...prevState, isConnecting: true }));
    
    try {
      const result = await web3Service.initWeb3();
      
      if (result.success) {
        setWeb3State({
          isInitialized: true,
          isConnecting: false,
          account: result.account,
          networkId: result.networkId,
          error: null
        });
        
        return { success: true };
      } else {
        setWeb3State(prevState => ({
          ...prevState,
          isConnecting: false,
          error: result.error
        }));
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      setWeb3State(prevState => ({
        ...prevState,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet'
      }));
      
      return { success: false, error: error.message || 'Failed to connect wallet' };
    }
  };

  // Add a product
  const addProduct = async (productData) => {
    try {
      const { name, description, price, category, location, imageUrl } = productData;
      
      return await web3Service.addProduct(
        name,
        description,
        price,
        category,
        location,
        imageUrl
      );
    } catch (error) {
      console.error('Error in addProduct:', error);
      throw error;
    }
  };

  // Get product details
  const getProduct = async (productId) => {
    try {
      return await web3Service.getProduct(productId);
    } catch (error) {
      console.error('Error in getProduct:', error);
      throw error;
    }
  };

  // Get all products
  const getAllProducts = async () => {
    try {
      return await web3Service.getAllProducts();
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  };

  // Add a document
  const addDocument = async (productId, documentHash, documentType) => {
    try {
      return await web3Service.addDocument(productId, documentHash, documentType);
    } catch (error) {
      console.error('Error in addDocument:', error);
      throw error;
    }
  };

  // Verify a document
  const verifyDocument = async (documentId) => {
    try {
      return await web3Service.verifyDocument(documentId);
    } catch (error) {
      console.error('Error in verifyDocument:', error);
      throw error;
    }
  };

  // Get documents for a product
  const getDocuments = async (productId) => {
    try {
      return await web3Service.getDocuments(productId);
    } catch (error) {
      console.error('Error in getDocuments:', error);
      throw error;
    }
  };

  // Create a payment
  const createPayment = async (productId, amount) => {
    try {
      return await web3Service.createPayment(productId, amount);
    } catch (error) {
      console.error('Error in createPayment:', error);
      throw error;
    }
  };

  // Complete a payment
  const completePayment = async (paymentId) => {
    try {
      return await web3Service.completePayment(paymentId);
    } catch (error) {
      console.error('Error in completePayment:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    ...web3State,
    connectWallet,
    addProduct,
    getProduct,
    getAllProducts,
    addDocument,
    verifyDocument,
    getDocuments,
    createPayment,
    completePayment
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  
  return context;
};

export default Web3Context; 