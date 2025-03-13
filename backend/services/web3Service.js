const Web3 = require('web3');
const SupplyChainContract = require('../utils/contracts/SupplyChain');
const DocumentVerificationContract = require('../utils/contracts/DocumentVerification');
const SupplyChainPaymentContract = require('../utils/contracts/SupplyChainPayment');

// Contract addresses - these would be set after deployment
const SUPPLY_CHAIN_ADDRESS = process.env.SUPPLY_CHAIN_ADDRESS || '0x0000000000000000000000000000000000000000';
const DOCUMENT_VERIFICATION_ADDRESS = process.env.DOCUMENT_VERIFICATION_ADDRESS || '0x0000000000000000000000000000000000000000';
const SUPPLY_CHAIN_PAYMENT_ADDRESS = process.env.SUPPLY_CHAIN_PAYMENT_ADDRESS || '0x0000000000000000000000000000000000000000';

// Initialize web3
let web3;
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server OR the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    process.env.ETHEREUM_RPC_URL || 'http://localhost:8545'
  );
  web3 = new Web3(provider);
}

// Initialize contracts
const supplyChain = new web3.eth.Contract(
  SupplyChainContract.abi,
  SUPPLY_CHAIN_ADDRESS
);

const documentVerification = new web3.eth.Contract(
  DocumentVerificationContract.abi,
  DOCUMENT_VERIFICATION_ADDRESS
);

const supplyChainPayment = new web3.eth.Contract(
  SupplyChainPaymentContract.abi,
  SUPPLY_CHAIN_PAYMENT_ADDRESS
);

// Helper function to get accounts
const getAccounts = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    return accounts;
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
};

// Supply Chain Contract Methods
const supplyChainService = {
  // Product related methods
  createProduct: async (name, description, price, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await supplyChain.methods
        .createProduct(name, description, price)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  getProductDetails: async (productId) => {
    try {
      const result = await supplyChain.methods
        .getProductDetails(productId)
        .call();
      
      return result;
    } catch (error) {
      console.error('Error getting product details:', error);
      throw error;
    }
  },
  
  addShipmentUpdate: async (productId, location, notes, status, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await supplyChain.methods
        .addShipmentUpdate(productId, location, notes, status)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error adding shipment update:', error);
      throw error;
    }
  },
  
  getShipmentUpdate: async (productId, updateId) => {
    try {
      const result = await supplyChain.methods
        .getShipmentUpdate(productId, updateId)
        .call();
      
      return result;
    } catch (error) {
      console.error('Error getting shipment update:', error);
      throw error;
    }
  },
  
  // User related methods
  registerUser: async (userAddress, name, role, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await supplyChain.methods
        .registerUser(userAddress, name, role)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  
  getUserDetails: async (userAddress) => {
    try {
      const result = await supplyChain.methods
        .getUserDetails(userAddress)
        .call();
      
      return result;
    } catch (error) {
      console.error('Error getting user details:', error);
      throw error;
    }
  },
  
  // Admin related methods
  addAdmin: async (adminAddress, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await supplyChain.methods
        .addAdmin(adminAddress)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error adding admin:', error);
      throw error;
    }
  },
  
  removeAdmin: async (adminAddress, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await supplyChain.methods
        .removeAdmin(adminAddress)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error removing admin:', error);
      throw error;
    }
  },
  
  isAdmin: async (address) => {
    try {
      const result = await supplyChain.methods
        .isAdmin(address)
        .call();
      
      return result;
    } catch (error) {
      console.error('Error checking if address is admin:', error);
      throw error;
    }
  }
};

// Document Verification Contract Methods
const documentVerificationService = {
  addDocument: async (productId, documentType, documentHash, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await documentVerification.methods
        .addDocument(productId, documentType, documentHash)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  },
  
  verifyDocument: async (documentId, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await documentVerification.methods
        .verifyDocument(documentId)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error verifying document:', error);
      throw error;
    }
  },
  
  getDocumentDetails: async (documentId) => {
    try {
      const result = await documentVerification.methods
        .getDocumentDetails(documentId)
        .call();
      
      return result;
    } catch (error) {
      console.error('Error getting document details:', error);
      throw error;
    }
  },
  
  getProductDocuments: async (productId) => {
    try {
      const result = await documentVerification.methods
        .getProductDocuments(productId)
        .call();
      
      return result;
    } catch (error) {
      console.error('Error getting product documents:', error);
      throw error;
    }
  },
  
  addVerifier: async (verifierAddress, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await documentVerification.methods
        .addVerifier(verifierAddress)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error adding verifier:', error);
      throw error;
    }
  },
  
  removeVerifier: async (verifierAddress, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await documentVerification.methods
        .removeVerifier(verifierAddress)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error removing verifier:', error);
      throw error;
    }
  },
  
  isVerifier: async (address) => {
    try {
      const result = await documentVerification.methods
        .isVerifier(address)
        .call();
      
      return result;
    } catch (error) {
      console.error('Error checking if address is verifier:', error);
      throw error;
    }
  }
};

// Supply Chain Payment Contract Methods
const paymentService = {
  createPayment: async (productId, payeeAddress, amount, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await supplyChainPayment.methods
        .createPayment(productId, payeeAddress)
        .send({ from: sender, value: amount });
      
      return result;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },
  
  completePayment: async (paymentId, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await supplyChainPayment.methods
        .completePayment(paymentId)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error completing payment:', error);
      throw error;
    }
  },
  
  refundPayment: async (paymentId, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await supplyChainPayment.methods
        .refundPayment(paymentId)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  },
  
  disputePayment: async (paymentId, reason, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await supplyChainPayment.methods
        .disputePayment(paymentId, reason)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error disputing payment:', error);
      throw error;
    }
  },
  
  getPaymentDetails: async (paymentId) => {
    try {
      const result = await supplyChainPayment.methods
        .getPaymentDetails(paymentId)
        .call();
      
      return result;
    } catch (error) {
      console.error('Error getting payment details:', error);
      throw error;
    }
  },
  
  createEscrow: async (productId, sellerAddress, releaseTime, amount, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await supplyChainPayment.methods
        .createEscrow(productId, sellerAddress, releaseTime)
        .send({ from: sender, value: amount });
      
      return result;
    } catch (error) {
      console.error('Error creating escrow:', error);
      throw error;
    }
  },
  
  releaseEscrow: async (escrowId, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await supplyChainPayment.methods
        .releaseEscrow(escrowId)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error releasing escrow:', error);
      throw error;
    }
  },
  
  refundEscrow: async (escrowId, from) => {
    try {
      const accounts = await getAccounts();
      const sender = from || accounts[0];
      
      const result = await supplyChainPayment.methods
        .refundEscrow(escrowId)
        .send({ from: sender });
      
      return result;
    } catch (error) {
      console.error('Error refunding escrow:', error);
      throw error;
    }
  },
  
  getEscrowDetails: async (escrowId) => {
    try {
      const result = await supplyChainPayment.methods
        .getEscrowDetails(escrowId)
        .call();
      
      return result;
    } catch (error) {
      console.error('Error getting escrow details:', error);
      throw error;
    }
  }
};

module.exports = {
  web3,
  supplyChainService,
  documentVerificationService,
  paymentService
}; 