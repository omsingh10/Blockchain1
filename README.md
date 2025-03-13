# Blockchain-Based Supply Chain Management System

A comprehensive blockchain-powered platform that ensures end-to-end visibility, security, and efficiency in the supply chain. The platform provides real-time, immutable tracking of goods, enabling stakeholders to access verified and tamper-proof data at every stage of the product journey.

## Features

- **End-to-End Product Tracking**: Real-time tracking of products from manufacturer to customer
- **Document Verification**: Secure storage and verification of supply chain documents
- **Smart Contract Automation**: Automated payments, compliance checks, and transaction validation
- **Blockchain Integration**: Immutable record-keeping for transparency and trust
- **Role-Based Access Control**: Different access levels for manufacturers, distributors, retailers, and customers
- **Payment System**: Secure cryptocurrency payments with escrow functionality

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Web3.js (Ethereum integration)
- JWT Authentication

### Frontend
- React.js
- React Router
- Context API for state management
- Material UI components
- Axios for API calls

### Blockchain
- Ethereum Smart Contracts (Solidity)
- Truffle/Hardhat for development and testing
- Ganache for local blockchain development

## Smart Contracts

1. **SupplyChain.sol**: Manages product creation, tracking, and status updates
2. **DocumentVerification.sol**: Handles document storage, verification, and compliance
3. **SupplyChainPayment.sol**: Manages payments, escrow, and financial transactions

## Project Structure

```
├── backend/                # Node.js Express backend
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
├── contracts/              # Ethereum smart contracts
│   ├── SupplyChain.sol
│   ├── DocumentVerification.sol
│   └── SupplyChainPayment.sol
├── frontend/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # React components
│       ├── context/        # Context API state
│       ├── utils/          # Utility functions
│       └── App.js          # Main component
└── scripts/                # Deployment scripts
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB
- Ganache or other Ethereum development environment
- MetaMask or other Ethereum wallet

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/supply-chain-blockchain
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   BLOCKCHAIN_PROVIDER=http://localhost:8545
   SUPPLY_CHAIN_CONTRACT_ADDRESS=
   DOCUMENT_VERIFICATION_CONTRACT_ADDRESS=
   PAYMENT_CONTRACT_ADDRESS=
   ```
4. Start the server: `npm run dev`

### Smart Contract Deployment
1. Install Truffle globally: `npm install -g truffle`
2. Start Ganache
3. Navigate to the project root
4. Compile contracts: `truffle compile`
5. Deploy contracts: `truffle migrate`
6. Update the contract addresses in the backend `.env` file

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## User Roles

1. **Admin**: System administrator with full access
2. **Manufacturer**: Creates products and initiates the supply chain
3. **Distributor**: Handles product distribution and logistics
4. **Retailer**: Receives products and sells to customers
5. **Customer**: End consumer who purchases products

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/products/:id/status` - Update product status

### Shipments
- `GET /api/shipments` - Get all shipments
- `GET /api/shipments/:id` - Get single shipment
- `POST /api/shipments` - Create new shipment
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment

### Documents
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get single document
- `POST /api/documents` - Create new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `PUT /api/documents/:id/verify` - Verify document

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id/complete` - Complete payment
- `PUT /api/payments/:id/refund` - Refund payment
- `POST /api/payments/escrow` - Create escrow payment
- `PUT /api/payments/escrow/:id/release` - Release escrow

## License

MIT 