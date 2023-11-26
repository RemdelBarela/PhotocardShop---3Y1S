import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MetaData from '../Layout/MetaData'

const OrderSuccess = () => {
    
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
      // Retrieve cartItems from localStorage
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItems(storedCartItems);
    //   console.log(cartItems);
    }, []);

    sessionStorage.removeItem('orderInfo');
    
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingInfo');
    // localStorage.clear();
    console.log(cartItems)

    
    return (
        <Fragment>

            <MetaData title={'Order Success'} />

            <div className="row justify-content-center">
                <div className="col-6 mt-5 text-center">
                    <img className="my-5 img-fluid d-block mx-auto" src="/images/order_success.png" alt="Order Success" width="200" height="200" />

                    <h2>Your Order has been placed successfully.</h2>

                    <Link to="/orders/me">Go to Orders</Link>
                </div>

            </div>

        </Fragment>
    )
}

export default OrderSuccess