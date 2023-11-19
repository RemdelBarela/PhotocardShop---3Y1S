import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 fixed-bottom">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0">&copy; 2023 PhotocardShop</p>
          </div>
          <div className="col-md-6">
            <div className="social-icons text-md-right">
              <span className="mr-2">Follow Us</span>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="ml-3">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="ml-3">
              <i class="fab fa-instagram" style={{ color: '#e63d70' }}></i>

              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
