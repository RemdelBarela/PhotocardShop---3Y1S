import React, { Fragment, useState, useEffect } from 'react'
import { Link, useParams, useNavigate,  } from 'react-router-dom'
import MetaData from '../../Layout/MetaData'
import Loader from '../../Layout/Loader'
import Sidebar from '../Sidebar'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { getToken } from '../../../utils/helpers'
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

const ProcessOrder = () => {

    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [order, setOrder] = useState({})
    const [isUpdated, setIsUpdated] = useState(false)
    let navigate = useNavigate()

    let { id } = useParams();
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order
    const orderId = id;
    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_RIGHT
    });

    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT
    });

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
            console.log(data)
        } catch (error) {
            setError(error.response.data.message)
        }
    }
    const updateOrder = async (id, formData) => {
      
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/order/${id}`, formData, config)
            setIsUpdated(data.success)
            

        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        getOrderDetails(orderId)
        if (error) {
            errMsg(error);
            setError('')
        }
        if (isUpdated) {
            successMsg('ORDER UPDATED SUCESSFULLY');
            setIsUpdated('')
            navigate('/admin/orders')
        }
    }, [error, isUpdated, orderId])

    const updateOrderHandler = (id) => {
        const formData = new FormData();
        formData.set('status', status);
        updateOrder(id, formData)
    }

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`
    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false
    return (
        <Fragment>
            <MetaData title={`Process Order # ${order && order._id}`} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        {loading ? <Loader /> : (
                            <div className="row d-flex justify-content-around">
                                <div className="col-12 col-lg-7 order-details">
                                    <h2 className="my-5">Order # {order._id}</h2>
                                    <h4 className="mb-4">Shipping Info</h4>
                                    <p><b>NAME:</b> {user && user.name}</p>
                                    <p><b>PHONE:</b> {shippingInfo && shippingInfo.phoneNo}</p>
                                    <p className="mb-4"><b>Address:</b>{shippingDetails}</p>
                                    <p><b>AMOUNT:</b> ${totalPrice}</p>
                                    <hr />
                                    <h4 className="my-4">PAYMENT</h4>
                                    <p className={isPaid ? "greenColor" : "redColor"}><b>{isPaid ? "PAID" : "NOT PAID"}</b></p>
                                    <h4 className="my-4">REFERENCE NUMBER:</h4>
                                    <p><b>{paymentInfo && paymentInfo.id}</b></p>

                                    <h4 className="my-4">ORDER STATUS::</h4>
                                    <p className={order.orderStatus && String(order.orderStatus).includes('Delivered') ? "blueColor" : "redColor"} ><b>{orderStatus}</b></p>
                                    <h4 className="my-4">ORDER ITEMS:</h4>
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
                                <div className="col-12 col-lg-3 mt-5">
                                    <h4 className="my-4">Status</h4>
                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name='status'
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>
                                    <button className="btn btn-primary btn-block" onClick={() => updateOrderHandler(order._id)}>
                                        Update Status
                                    </button>
                                </div>
                            </div>
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}
export default ProcessOrder