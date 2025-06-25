import React, { useState } from 'react';
import { FaTwitter, FaInstagram, FaLinkedin, FaArrowRight } from 'react-icons/fa';
import '../../Styles/Footer.css'; // Import your CSS file

const Footer = () => {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your newsletter subscription logic here
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2 className="footer-title">Aero NewsApp</h2>
          <p className="footer-description">
            Your trusted source for breaking news, in-depth analysis, and diverse perspectives.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Categories</h3>
          <ul className="footer-links">
            <li><a href="/#/user/category/684a60684b112a1955189f9f">Politics</a></li>
            <li><a href="/#/user/category/684a60cd4b112a1955189fae">Business</a></li>
            <li><a href="/#/user/category/684a620b4b112a1955189fd8">Technology</a></li>
            <li><a href="/#/user/category/684a61b74b112a1955189fc9">Entertainment</a></li>
            <li><a href="/#/user/category/684a61184b112a1955189fbd">Sports</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Company</h3>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/advertise">Advertise</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Connect With Us</h3>
          <div className="social-icons">
            <a href="https://twitter.com/NewsApp" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com/NewsApp" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com/company/NewsApp" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
          
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {currentYear} AeroNewsApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
