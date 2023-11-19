import React, { useEffect, useState } from "react";
import { BiMenuAltRight } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Search from './Search'
import axios from 'axios'
import { logout, getUser } from '../../utils/helpers'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function Header() {
  const [user, setUser] = useState({})
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const logoutUser = async () => {
    try {
        await axios.get(`${process.env.REACT_APP_API}/api/v1/logout`)
        setUser({})
        logout(() => navigate('/'))
    } catch (error) {
        toast.error(error.response.data.message)

    }
}

  const logoutHandler = () => {
    logoutUser();
    toast.success('log out', {
        position: toast.POSITION.BOTTOM_RIGHT
    });
}
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (size.width > 768 && menuOpen) {
      setMenuOpen(false);
    }
  }, [size.width, menuOpen]);

  return (
    <header className="header">
      <div className="header__content">
        <Link to="/" className="header__content__logo">
          PHOTOCARDSHOP
        </Link>
        <nav className={`header__content__nav ${menuOpen && size.width < 768 ? "isMenu" : ""}`}>
          <ul>
            <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
              <Link to="/me" style={{ textDecoration: 'none' }} >
                <span id="cart" className="ml-3">PROFILE</span>       
              </Link>
            </div>
            <li>
              <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                <Link to="/cart" style={{ textDecoration: 'none' }} >
                  <span id="cart" className="ml-3">CART</span>
                  {/* <span className="ml-1" id="cart_count">{cartItems.length}</span> */}
                </Link>
              </div>
            </li>
            <li>
            {user && user.role === 'admin' && (
              <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                <Link to="/dashboard" style={{ textDecoration: 'none' }} >
                  <span id="cart" className="ml-3">DASHBOARD</span>
                  {/* <span className="ml-1" id="cart_count">{cartItems.length}</span> */}
                </Link>
              </div>
            )}
            </li>
          </ul>
          <div className="header__content__buttons">
            <Link to="/register">
              <button className="btn">Register</button>
            </Link>
            
            {user ? ( 
              <Link to="/logout">
                <button className="btn btn__login" onClick={logoutHandler}>Logout</button>
              </Link>
              ) : (
              <Link to="/login">
                <button className="btn btn__login">Login</button>
              </Link>)}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
