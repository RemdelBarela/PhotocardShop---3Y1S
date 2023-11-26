import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import { getToken } from '../../../utils/helpers'
import MetaData from '../../Layout/MetaData'
import { Link, useParams, useNavigate,  } from 'react-router-dom'
import ReceiptPDF from './ReceiptPDF';
import {PDFDownloadLink } from '@react-pdf/renderer';
import {
  MDBCard,
  MDBCardBody,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBTypography,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";

const Receipt = () => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [order, setOrder] = useState({})

    let { id } = useParams();
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order

    const getOrderDetails = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/print-receipt/${id}`, config)
            setOrder(data.order)
            setLoading(false)
            console.log(data)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        const orderId = id;
        getOrderDetails(orderId);
    }, []);

    
  return (
    <Fragment>
        <MetaData title={`Receipt Order #  ${order && order._id}`} />
        
            <MDBContainer className="py-5" id="receipt">
            <MDBCard className="p-4">
                <MDBCardBody>
                <MDBContainer className="mb-2 mt-3">
                    <MDBRow className="d-flex align-items-baseline">
                    <MDBCol xl="9">
                        <p style={{ color: "#7e8d9f", fontSize: "20px" }}>
                        INVOICE # {order._id}
                        </p>
                    </MDBCol>
                    <MDBCol xl="3" className="float-end" id="colprint">
                        {/* <button
                        color="light"
                        ripple="dark"
                        className="text-capitalize border-0"
                        id="print"
                        > */}
                        <MDBIcon fas icon="print" color="primary" className="me-1" />
                        <PDFDownloadLink document={<ReceiptPDF order={order} />}
                            fileName={`Receipt_Order_${order._id}.pdf`}>
                            {({ blob, url, loading, error }) =>
                            loading ? 'Generating PDF...' : 'PRINT'
                            }
                        </PDFDownloadLink>
                        {/* </button> */}
                    </MDBCol>
                    </MDBRow>
                    <hr />
                </MDBContainer>
                <MDBRow>
                    <MDBCol xl="8">
                    <MDBTypography listUnStyled>
                        <li className="text-muted">
                        To: <span style={{ color: "#5d9fc5" }}>{user && user.name}</span>
                        </li>
                        <li className="text-muted">{shippingInfo && shippingInfo.address}</li>
                        <li className="text-muted">
                        <MDBIcon fas icon="phone-alt" /> {shippingInfo && shippingInfo.phoneNo}
                        </li>
                    </MDBTypography>
                    </MDBCol>
                    <MDBCol xl="4">
                    <MDBTypography listUnStyled>
                        <li className="text-muted">
                        <MDBIcon fas icon="circle" style={{ color: "#84B0CA" }} />
                        <span className="fw-bold ms-1">Status: </span>
                        <span className="badge bg-warning text-black fw-bold ms-1">
                            {order.orderStatus}
                        </span>
                        </li>
                    </MDBTypography>
                    </MDBCol>
                </MDBRow>
                <MDBRow className="my-2 mx-1 justify-content-center">
                    <MDBTable striped borderless>
                    <MDBTableHead
                        className="text-white"
                        style={{ backgroundColor: "#84B0CA" }}
                    >
                        <tr>
                        <th scope="col">PHOTO</th>
                        <th scope="col">MATERIAL</th>
                        <th scope="col">QTY</th>
                        <th scope="col">UNIT PRICE</th>
                        <th scope="col">AMOUNT</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        <Fragment>
                            {orderItems && orderItems.map(item => (
                                <Fragment>
                                    <tr>
                                        <td>{item.Pname}</td>
                                        <td>{item.Mname}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price}</td>
                                        <td>{(item.price * item.quantity)}</td>
                                        
                                    </tr>
                                </Fragment>
                            ))} 
                        </Fragment>
                    </MDBTableBody>
                    </MDBTable>
                </MDBRow>
                <MDBRow>
                    <MDBCol xl="3">
                    <MDBTypography listUnStyled>
                        <li className="text-muted ms-3">
                        <span class="text-black me-4">SUBTOTAL:</span>₱ {order.itemsPrice}
                        </li>
                        <li className="text-muted ms-3 mt-2">
                        <span class="text-black me-4">SHIPPING: </span>₱ {order.shippingPrice}
                        </li>
                        <li className="text-muted ms-3 mt-2">
                        <span class="text-black me-4">TAX(0.5%):</span>₱ {order.taxPrice}
                        </li>
                    </MDBTypography>
                    </MDBCol>
                    <MDBCol xl="8" id="tPrice">
                   
                    <p className="text-black float-end">
                        <span className="text-black me-3">TOTAL AMOUNT</span>
                        <span style={{ fontSize: "25px" }}>₱ {order.totalPrice}</span>
                    </p>
                    </MDBCol>
                </MDBRow>
                <hr />
                </MDBCardBody>
            </MDBCard>
            </MDBContainer>
    </Fragment>
  )
}


export default Receipt;