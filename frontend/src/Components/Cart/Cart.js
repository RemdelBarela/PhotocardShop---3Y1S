import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import { useParams, useNavigate } from 'react-router-dom'
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBRow,
    MDBTypography,
  } from "mdb-react-ui-kit";
const Cart = ({ addItemToCart, cartItems, removeItemFromCart }) => {
    const navigate = useNavigate()

    const increaseQty = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (newQty > stock) return;
        addItemToCart(id, newQty);
    }

    const decreaseQty = (id, quantity) => {
        const newQty = quantity - 1;
        if (newQty <= 0) return;
        addItemToCart(id, newQty);
    }

    const removeCartItemHandler = (id) => {
        removeItemFromCart(id)
    }
    const checkoutHandler = () => {
        navigate('/login?redirect=shipping')
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems))

    return (
        <section className="h-100" style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol md="10">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <MDBTypography tag="h3" className="fw-normal mb-0 text-black">
                  Shopping Cart
                </MDBTypography>

         
                <div>
                  <p className="mb-0">
                    <span className="text-muted">Sort by:</span>
                    <a href="#!" className="text-body">
                      price <i className="fas fa-angle-down mt-1"></i>
                    </a>
                  </p>
                </div>
              </div>
       
            
           


              {cartItems.length === 0 ? <h2 className="mt-5">Your Cart is Empty</h2> : (
                <Fragment>
                      {cartItems.map(item => (

                                
                                <Fragment>
                           
                          
                      
        <MDBCard className="rounded-3 mb-4">
          <MDBCardBody className="p-4">
            <MDBRow className="justify-content-between align-items-center">
              <MDBCol md="2" lg="2" xl="2">
                
              {item.images && item.images.map(image => (
                                         <img className="d-block w-100" src={image.url} alt={item.title} />
                                     
                                 ))}


                <MDBCardImage className="rounded-3" fluid
                  src={item.images}
                  alt="Cotton T-shirt" />
              </MDBCol>
              <MDBCol md="3" lg="3" xl="3">
                <p className="lead fw-normal mb-2">
                    
                <div className="col-5 col-lg-3">
                                                <Link to={`/products/${item.product}`}>{item.name}</Link>
                                            </div>


                </p>
                <p>
                  <span className="text-muted">Size: </span>M{" "}
                  <span className="text-muted">Color: </span>Grey
                </p>
              </MDBCol>
              <MDBCol md="3" lg="3" xl="2"
                className="d-flex align-items-center justify-content-around">
                <MDBBtn color="link" className="px-2">
                <span  onClick={() => decreaseQty(item.product, item.quantity)}>
                                            
                  <MDBIcon fas icon="minus" />

                  </span>
                </MDBBtn>

                <MDBInput min={0} defaultValue={item.quantity} type="number" size="lg" />

                <MDBBtn color="link" className="px-2">
                  <span  onClick={() => increaseQty(item.product, item.quantity, item.stock)}>
                  <MDBIcon fas icon="plus" />
                </span>

                </MDBBtn>
              </MDBCol>
              <MDBCol md="3" lg="2" xl="2" className="offset-lg-1">
                <MDBTypography tag="h5" className="mb-0">
                ${item.price}
                </MDBTypography>
              </MDBCol>
              <MDBCol md="1" lg="1" xl="1" className="text-end">
                <i id="delete_cart_item" className="text-danger" onClick={() => removeCartItemHandler(item.product)} >
                                         
                  <MDBIcon fas icon="trash text-danger" size="lg" />
                </i>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>

                                 
                                </Fragment>
                            ))}

                      



                        <MDBCard>
                <MDBCardBody>
                     <div id="order_summary">
                                <h4>Order Summary</h4>
                                <hr />
                                <p>Subtotal:  <span className="order-summary-values">{cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0)} (Units)</span></p>
                                <p>Est. total: <span className="order-summary-values">${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</span></p>


                                <hr />
                                <button id="checkout_btn" className="btn btn-primary btn-block" onClick={checkoutHandler}>Check out</button>
                                {/*<button id="checkout_btn" className="btn btn-primary btn-block" >Check out</button>*/}
                            </div>
                 
                </MDBCardBody>
              </MDBCard>


                   
                </Fragment>
            )}
            

              
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
      );
}

export default Cart