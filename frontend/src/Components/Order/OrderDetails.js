import React, { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers'
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

const OrderDetails = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [order, setOrder] = useState({})

    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order
    let { id } = useParams();

    const getOrderDetails = async (id) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/order/${id}`, config)
            setOrder(data.order)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        getOrderDetails(id)

        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }, [error, id])

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false

    return (
        <Fragment>
          <MetaData title={'Order Details'} />
      
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <div className="row d-flex justify-content-center">
                <div className="col-49 col-lg-8 mt-5 order-details mx-auto text-left"style={{ marginBottom: '90px' }}>
      
                  <h1 className="my-4">Order #{order._id}</h1>
      
                  <h4 className="mb-4">Shipping Info</h4>
                  <p><b>Name:</b> {user && user.name}</p>
                  <p><b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}</p>
                  <p className="mb-4"><b>Address:</b>{shippingDetails}</p>
                  <p><b>Amount:</b> ${totalPrice}</p>
      
                  <hr />
      
                  <h4 className="my-4">Payment</h4>
                  <p className={isPaid ? "greenColor" : "redColor"}><b>{isPaid ? "PAID" : "NOT PAID"}</b></p>
      
                  <h4 className="my-4">Order Status:</h4>
                  <p className={order.orderStatus && String(order.orderStatus).includes('Delivered') ? "greenColor" : "redColor"} ><b>{orderStatus}</b></p>
      
                  <h4 className="my-4">Order Items:</h4>
      
                  <hr />
                  <div className="cart-item my-1">
                  <Fragment>
                                        {orderItems && orderItems.map(item => (
                                            <Fragment>
                                            
                                    <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                                        <MDBCol md="2" lg="2" xl="2">
                                        {/* <MDBCardImage> */}
                                            <Carousel pause='hover'>
                                                {item.images && item.images.map(image => (
                                                    <Carousel.Item key={image.public_id}>
                                                        <img className="d-block w-100" src={image.url} alt={item.Pname} />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                        {/* </MDBCardImage> */}
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
                                        <span> ₱ {item.price}</span>
                                        </MDBCol>
                                        <MDBCol md="3" lg="3" xl="3" className="d-flex align-items-center">
                                        <span>{item.quantity} PIECE/S</span>
                                        </MDBCol>
                                    </MDBRow>

                                    </Fragment>
                                                ))}    
                                                </Fragment>
                                                </div>
                  <hr />
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      );
      
}

export default OrderDetails