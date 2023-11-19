import React, {useState, useEffect} from 'react';
import { getUser } from '../../utils/helpers'

const Footer = () => {
  const [user, setUser] = useState({})

  useEffect(() => {
    setUser(getUser())
}, [])
  return (
    <footer className="bg-dark text-white py-3 fixed-bottom">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 ">
            <p className="mb-0">&copy; 2023 PhotocardShop</p>
          </div>
          {user ? (
            <div className="col-md-6 d-flex justify-content-end">
            <p className="mb-0"><i>Welcome, <b>{user && user.name}</b></i></p>
          </div>
          ) : ([])}

          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
