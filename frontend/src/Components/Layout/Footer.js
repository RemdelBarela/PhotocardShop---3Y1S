import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5 className="mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/">Home</a></li>
              <li><a href="/shop">Shop</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5 className="mb-4">Newsletter</h5>
            <p>Subscribe to our newsletter for the latest updates and exclusive offers.</p>
            <form>
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Enter your email" />
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button">Subscribe</button>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-4">
            <h5 className="mb-4">Follow Us</h5>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>&copy; 2022 Your E-Commerce Shop. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;