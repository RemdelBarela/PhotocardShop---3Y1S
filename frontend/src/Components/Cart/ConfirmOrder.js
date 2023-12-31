import React, { Fragment, useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { getUser } from '../../utils/helpers'
import { Carousel } from 'react-bootstrap'
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardText,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBRow,
    MDBTypography,
    } from "mdb-react-ui-kit";

const ConfirmOrder = ({ shippingInfo}) => {
    const [user, setUser] = useState(getUser() ? getUser() : {})
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
      // Retrieve cartItems from localStorage
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItems(storedCartItems);
      console.log(storedCartItems);
    }, []);
    
    
    let navigate = useNavigate();
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shippingPrice = itemsPrice > 200 ? 0 : 25
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2))
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

    const processToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice
        }

        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        navigate('/payment')
    }
 
    return (
        <Fragment>
            <MetaData title={'Confirm Order'} />
            <CheckoutSteps shipping confirmOrder />
            
            <div className="row wrapper" style={{marginTop:"10px",marginBottom:"100px"}}>
        <div className="col-10 col-lg-5">
          
                   <h4 className="mb-3">SHIPPING DETAILS</h4>
                    {user && <p><b>NAME:</b> {user && user.name}</p>}
                    <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                    <p className="mb-4"><b>ADDRESS:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>

                    <hr />
                    <h4 className="mt-4">Your Cart Items:</h4>

                    <hr className="my-4" />
                    <Fragment>
  {cartItems.map(item => (
    <Fragment key={item.photocard}>
      <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
        <MDBCol md="2" lg="2" xl="2">
          <Carousel pause='hover'>
            {item.images && item.images.map(image => (
              <Carousel.Item key={image.public_id}>
                <img className="d-block w-100" src={image.url} alt={item.name} />
              </Carousel.Item>
            ))}
          </Carousel>
        </MDBCol>
        <MDBCol md="3" lg="3" xl="3">
          <MDBTypography tag="h6" className="text-muted">
            {item.Mname}
          </MDBTypography>
          <MDBTypography tag="h4" className="text-black mb-0">
            {item.Pname}
          </MDBTypography>
        </MDBCol>
        <MDBCol md="3" lg="3" xl="3" className="d-flex align-items-center">
          <span>{item.quantity} x {item.price}</span>
        </MDBCol>
        <MDBCol md="3" lg="2" xl="2" className="text-end">
          <MDBTypography tag="h6" className="mb-0">
            ₱ {item.price}
          </MDBTypography>
        </MDBCol>
      </MDBRow>
    </Fragment>
  ))}
</Fragment>

      
                </div>

                <div className="col-12 col-lg-3 my-4" style={{marginBottom:"70px"}}>
                    <div id="order_summary">
                        <h4>ORDER SUMMARY</h4>
                        <hr />
                        <p>SUBTOTAL:  <span className="order-summary-values">${itemsPrice.toFixed(2)}</span></p>
                        <p>SHIPPING: <span className="order-summary-values">${shippingPrice}</span></p>
                        <p>TAX(0.05%):  <span className="order-summary-values">${taxPrice}</span></p>

                        <hr />

                        <p>Total: <span className="order-summary-values">${totalPrice}</span></p>

                        <hr />
                        <button id="checkout_btn" className="btn btn-primary btn-block" onClick={processToPayment}>PROCEED TO PAYMENT</button>
                    </div>
                </div>


            </div>

        </Fragment>
    )
}

export default ConfirmOrder