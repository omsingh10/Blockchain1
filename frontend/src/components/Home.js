import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Supply Chain Blockchain</h1>
          <p className="hero-subtitle">
            A blockchain-powered platform for end-to-end supply chain visibility
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn primary">
              Explore Products
            </Link>
            <Link to="/register" className="btn secondary">
              Join Now
            </Link>
          </div>
        </div>
      </section>
      
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Complete Transparency</h3>
              <p>
                Track products from origin to consumer with immutable blockchain records.
                Every step of the supply chain is recorded and verifiable.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Transactions</h3>
              <p>
                All payments and escrow services are secured by smart contracts,
                ensuring fair and transparent financial transactions.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Document Verification</h3>
              <p>
                Verify the authenticity of certificates, quality inspections, and
                other critical documents with our blockchain verification system.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-time Updates</h3>
              <p>
                Get instant notifications and updates on product status changes,
                shipment locations, and verification events.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Product Registration</h3>
              <p>
                Manufacturers register products on the blockchain with detailed
                information and documentation.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <h3>Supply Chain Tracking</h3>
              <p>
                Each participant updates the product status and location as it
                moves through the supply chain.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <h3>Document Verification</h3>
              <p>
                Authorized verifiers confirm the authenticity of documents and
                certifications.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <h3>Secure Payments</h3>
              <p>
                Buyers can make secure payments or create escrow contracts for
                products with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cta">
        <div className="container">
          <h2>Ready to Transform Your Supply Chain?</h2>
          <p>
            Join our platform today and experience the benefits of blockchain
            technology in your supply chain operations.
          </p>
          <Link to="/register" className="btn primary">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;