import Web3 from 'web3';
import SupplyChainABI from '../utils/contracts/SupplyChain';
import DocumentVerificationABI from '../utils/contracts/DocumentVerification';
import SupplyChainPaymentABI from '../utils/contracts/SupplyChainPayment';

class Web3Service {
  constructor() {
    this.web3 = null;
    this.accounts = [];
    this.networkId = null;
    this.supplyChainContract = null;
    this.documentVerificationContract = null;
    this.supplyChainPaymentContract = null;
    
    // Contract addresses - these would be updated after deployment
    this.contractAddresses = {
      supplyChain: process.env.REACT_APP_SUPPLY_CHAIN_ADDRESS || '',
      documentVerification: process.env.REACT_APP_DOCUMENT_VERIFICATION_ADDRESS || '',
      supplyChainPayment: process.env.REACT_APP_SUPPLY_CHAIN_PAYMENT_ADDRESS || ''
    };
    
    // Event listeners
    this.eventListeners = {};
  }

  // Initialize Web3 with MetaMask
  async initWeb3() {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create Web3 instance
        this.web3 = new Web3(window.ethereum);
        
        // Get connected accounts
        this.accounts = await this.web3.eth.getAccounts();
        
        // Get network ID
        this.networkId = await this.web3.eth.net.getId();
        
        // Initialize contracts
        this.initContracts();
        
        // Setup event listeners for account and network changes
        this.setupEventListeners();
        
        return {
          success: true,
          account: this.accounts[0],
          networkId: this.networkId
        };
      } catch (error) {
        console.error('Error initializing Web3:', error);
        return {
          success: false,
          error: 'Failed to connect to MetaMask. Please make sure it is installed and unlocked.'
        };
      }
    } else {
      return {
        success: false,
        error: 'MetaMask is not installed. Please install MetaMask to use this application.'
      };
    }
  }

  // Initialize smart contracts
  initContracts() {
    if (!this.web3) return;
    
    try {
      // Initialize Supply Chain contract
      if (this.contractAddresses.supplyChain) {
        this.supplyChainContract = new this.web3.eth.Contract(
          SupplyChainABI,
          this.contractAddresses.supplyChain
        );
      }
      
      // Initialize Document Verification contract
      if (this.contractAddresses.documentVerification) {
        this.documentVerificationContract = new this.web3.eth.Contract(
          DocumentVerificationABI,
          this.contractAddresses.documentVerification
        );
      }
      
      // Initialize Supply Chain Payment contract
      if (this.contractAddresses.supplyChainPayment) {
        this.supplyChainPaymentContract = new this.web3.eth.Contract(
          SupplyChainPaymentABI,
          this.contractAddresses.supplyChainPayment
        );
      }
    } catch (error) {
      console.error('Error initializing contracts:', error);
    }
  }

  // Setup event listeners for account and network changes
  setupEventListeners() {
    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        this.accounts = accounts;
        this.notifyListeners('accountsChanged', accounts);
      });
      
      // Listen for network changes
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload(); // Recommended by MetaMask
      });
    }
  }

  // Register event listeners
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  // Notify all listeners of an event
  notifyListeners(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  // Get current account
  getCurrentAccount() {
    return this.accounts[0] || null;
  }

  // Check if Web3 is initialized
  isInitialized() {
    return !!this.web3;
  }

  // Add a new product to the supply chain
  async addProduct(name, description, price, category, location, imageUrl) {
    if (!this.supplyChainContract || !this.accounts[0]) {
      throw new Error('Supply Chain contract not initialized or no account connected');
    }
    
    try {
      const priceInWei = this.web3.utils.toWei(price.toString(), 'ether');
      
      const result = await this.supplyChainContract.methods
        .addProduct(name, description, priceInWei, category, location, imageUrl)
        .send({ from: this.accounts[0] });
      
      return {
        success: true,
        transactionHash: result.transactionHash,
        productId: result.events.ProductAdded.returnValues.productId
      };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  // Get product details
  async getProduct(productId) {
    if (!this.supplyChainContract) {
      throw new Error('Supply Chain contract not initialized');
    }
    
    try {
      const product = await this.supplyChainContract.methods
        .getProduct(productId)
        .call();
      
      return {
        id: productId,
        name: product.name,
        description: product.description,
        price: this.web3.utils.fromWei(product.price, 'ether'),
        manufacturer: product.manufacturer,
        owner: product.currentOwner,
        status: this.getStatusText(product.status),
        createdAt: new Date(product.timestamp * 1000).toISOString()
      };
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  // Get all products
  async getAllProducts() {
    if (!this.supplyChainContract) {
      throw new Error('Supply Chain contract not initialized');
    }
    
    try {
      const productCount = await this.supplyChainContract.methods
        .getProductCount()
        .call();
      
      const products = [];
      
      for (let i = 1; i <= productCount; i++) {
        const product = await this.getProduct(i);
        products.push(product);
      }
      
      return products;
    } catch (error) {
      console.error('Error getting all products:', error);
      throw error;
    }
  }

  // Add a document to a product
  async addDocument(productId, documentHash, documentType) {
    if (!this.documentVerificationContract || !this.accounts[0]) {
      throw new Error('Document Verification contract not initialized or no account connected');
    }
    
    try {
      const result = await this.documentVerificationContract.methods
        .addDocument(productId, documentHash, documentType)
        .send({ from: this.accounts[0] });
      
      return {
        success: true,
        transactionHash: result.transactionHash,
        documentId: result.events.DocumentAdded.returnValues.documentId
      };
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  // Verify a document
  async verifyDocument(documentId) {
    if (!this.documentVerificationContract || !this.accounts[0]) {
      throw new Error('Document Verification contract not initialized or no account connected');
    }
    
    try {
      const result = await this.documentVerificationContract.methods
        .verifyDocument(documentId)
        .send({ from: this.accounts[0] });
      
      return {
        success: true,
        transactionHash: result.transactionHash
      };
    } catch (error) {
      console.error('Error verifying document:', error);
      throw error;
    }
  }

  // Get documents for a product
  async getDocuments(productId) {
    if (!this.documentVerificationContract) {
      throw new Error('Document Verification contract not initialized');
    }
    
    try {
      const documentCount = await this.documentVerificationContract.methods
        .getDocumentCount(productId)
        .call();
      
      const documents = [];
      
      for (let i = 0; i < documentCount; i++) {
        const document = await this.documentVerificationContract.methods
          .getDocument(productId, i)
          .call();
        
        documents.push({
          id: document.id,
          productId: document.productId,
          documentHash: document.documentHash,
          documentType: document.documentType,
          isVerified: document.isVerified,
          timestamp: new Date(document.timestamp * 1000).toISOString()
        });
      }
      
      return documents;
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Create a payment
  async createPayment(productId, amount) {
    if (!this.supplyChainPaymentContract || !this.accounts[0]) {
      throw new Error('Supply Chain Payment contract not initialized or no account connected');
    }
    
    try {
      const amountInWei = this.web3.utils.toWei(amount.toString(), 'ether');
      
      const result = await this.supplyChainPaymentContract.methods
        .createPayment(productId)
        .send({ from: this.accounts[0], value: amountInWei });
      
      return {
        success: true,
        transactionHash: result.transactionHash,
        paymentId: result.events.EscrowCreated.returnValues.paymentId
      };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // Complete a payment
  async completePayment(paymentId) {
    if (!this.supplyChainPaymentContract || !this.accounts[0]) {
      throw new Error('Supply Chain Payment contract not initialized or no account connected');
    }
    
    try {
      const result = await this.supplyChainPaymentContract.methods
        .completePayment(paymentId)
        .send({ from: this.accounts[0] });
      
      return {
        success: true,
        transactionHash: result.transactionHash
      };
    } catch (error) {
      console.error('Error completing payment:', error);
      throw error;
    }
  }

  // Helper function to convert status code to text
  getStatusText(statusCode) {
    const statusMap = {
      0: 'CREATED',
      1: 'PROCESSING',
      2: 'SHIPPED',
      3: 'DELIVERED',
      4: 'AVAILABLE'
    };
    
    return statusMap[statusCode] || 'UNKNOWN';
  }
}

// Create and export a singleton instance
const web3Service = new Web3Service();
export default web3Service; 