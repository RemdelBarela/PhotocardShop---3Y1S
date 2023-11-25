import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from './Search'
import axios from 'axios'
import { logout, getUser } from '../../utils/helpers'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function Header({ cartItems }) {
  const [user, setUser] = useState({})
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
        await axios.get(`${process.env.REACT_APP_API}/api/v1/logout`)
        setUser({})
        logout(() => navigate('/login'))
    } catch (error) {
        toast.error(error.response.data.message)
    }
  }

  const logoutHandler = () => {
    logoutUser();
    toast.success('LOG OUT', {
        position: toast.POSITION.BOTTOM_RIGHT
    });
}
    useEffect(() => {
      setUser(getUser())
    }, [])

  return (
    <Fragment>
    <header className="header">
      <div className="header__content">
        <Link to="/" className="header__content__logo">
          PHOTOCARDSHOP
        </Link>
        
        <nav className="header__content__nav">
        {user ? (
          <ul>
            <li>
            <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
              <Link to="/me" style={{ textDecoration: 'none' }} >
                <span id="profile" className="ml-3"><i class="fa-solid fa-user"></i>PROFILE</span>       
              </Link>
            </div>
            </li>
            <li>
              <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                <Link to="/cart" style={{ textDecoration: 'none' }} >
                  <span id="cart" className="ml-3">CART {cartItems.length}</span>
                </Link>
              </div>
            </li>
            <li>
              
              <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                <Link to="/dashboard" style={{ textDecoration: 'none' }} >
                  <span id="myOrders" className="ml-3">ORDERS</span>
                </Link>
              </div>
              
            </li>
            <li>
            {user && user.role === 'admin' && (
              <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                <Link to="/dashboard" style={{ textDecoration: 'none' }} >
                  <span id="dashboard" className="ml-3">DASHBOARD</span>
                </Link>
              </div>
              )}
            </li>
          </ul>
          ) : ([])}

          <div className="header__content__buttons">
            
            
            {user ? ( 
              <Link to="/logout">
                <button className="btn btn__login" onClick={logoutHandler}> <i className="fas fa-sign-out-alt"></i> </button>
              </Link>
              ) : (
              
              <Link to="/register">
              <button className="btn">REGISTER</button>
            </Link>)}
            {!user && ( // Show register button if not authenticated
              <Link to="/login">
                <button className="btn btn__login">LOGIN</button>
              </Link>
              )}
          </div>
        </nav>
      </div>
    </header>
    </Fragment>
  );
}

export default Header;
