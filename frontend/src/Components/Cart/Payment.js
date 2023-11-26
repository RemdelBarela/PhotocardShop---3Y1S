import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';


const Payment = ({shippingInfo}) => {
    const [loading, setLoading] = useState(true)
    let navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
      // Retrieve cartItems from localStorage
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItems(storedCartItems);
    //   console.log(cartItems);
    }, []);


    const order = {
        orderItems: cartItems,
        shippingInfo
    }


    // console.log(cartItems)

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }

    // console.log(cartItems)
    const createOrder = async (order) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/order/new`, order, config)
            // setIsUpdated(data.success)
            setLoading(false)
            toast.success('order created', {
                position: toast.POSITION.BOTTOM_RIGHT
            });

            navigate('/success')
    
        } catch (error) {
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
           }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        document.querySelector('#pay_btn').disabled = true;
        order.paymentInfo = {
            id: 'pi_1DpdYh2eZvKYlo2CYIynhU32',
            status: 'succeeded'
        }
        createOrder(order)

        console.log(cartItems)
       
      }

    // const submitHandler = async (e) => {
    //     e.preventDefault();
    //     document.querySelector('#pay_btn').disabled = true;
    //     order.paymentInfo = {
    //         id: 'pi_1DpdYh2eZvKYlo2CYIynhU32',
    //         status: 'succeeded'
    //     }
    
    //     // Remove purchased item(s) from cartItems
    //     // For example, if you want to clear cartItems after payment:
    //     const updatedCartItems = []; // Or any logic to remove purchased items
    //     setCartItems(updatedCartItems); // Update the cartItems state
    
    //     // Update the localStorage as well, if needed
    //     localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    
    //     createOrder(order);
    //     // localStorage.removeItem('cartItems');
    // };

    return (
        <Fragment>
            <MetaData title={'Payment'} />
            <CheckoutSteps shipping confirmOrder payment />
            <div className="row wrapper">
        <div className="col-10 col-lg-5">
        <form className="shipping-form" onSubmit={submitHandler}>
                   <h1 className="mb-4">Card Info</h1>
                        <div className="form-group">
                            <label htmlFor="card_num_field">Card Number</label>
                            <input
                                type="text"
                                id="card_num_field"
                                className="form-control"
                                
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_exp_field">Card Expiry</label>
                            <input
                                type="text"
                                id="card_exp_field"
                                className="form-control"
                               
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_cvc_field">Card CVC</label>
                            <input
                                type="text"
                                id="card_cvc_field"
                                className="form-control"
                                
                            />
                        </div>
                        <button
                            id="pay_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            Pay {` - ${orderInfo && orderInfo.totalPrice}`}
                        </button>

                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default Payment