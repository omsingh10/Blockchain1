import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import our components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import Product from './components/Product';
import AddProduct from './components/AddProduct';

// Import Web3 Provider
import { Web3Provider } from './contexts/Web3Context';

// Placeholder components - in a real app, these would be imported from separate files
const NotFound = () => <div className="container"><h1>404</h1><p>Page not found</p></div>;

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App; 