import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import MetaData from '../../Layout/MetaData'
import Loader from '../../Layout/Loader'
import Sidebar from '../Sidebar'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../../utils/helpers'
import axios from 'axios'

const OrdersList = () => {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [allOrders, setAllOrders] = useState([])
    const [isDeleted, setIsDeleted] = useState(false)
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [deleteError, setDeleteError] = useState('');
   
    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_RIGHT
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT
    });

    const listOrders = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/orders`, config)
            setAllOrders(data.orders)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)
        }
    }
    const deleteOrder = async (id) => {
        try { 
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/order/${id}`, config)
            setIsDeleted(data.success)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)

        }
    }


    const toggleAllOrdersSelection = () => {
        if (selectedOrders.length === allOrders.length) {
            // If all materials are selected, unselect all
           setSelectedOrders([]);
        } else {
            // Otherwise, select all materials
            setSelectedOrders(allOrders.map((orders) => orders._id));
        }
    };




    useEffect(() => {
        listOrders()
        if (error) {
            errMsg(error)
            setError('')
        }
        if (isDeleted) {
            successMsg('ORDER DELETED SUCCESFULLY');
            navigate('/admin/orders');
        }
    }, [error, isDeleted])
    const deleteOrderHandler = (id) => {
        deleteOrder(id)
    }

    
    const toggleOrderSelection = (id) => {
        const isSelected = selectedOrders.includes(id);
        if (isSelected) {
            setSelectedOrders(selectedOrders.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedOrders([...selectedOrders, id]);
        }
    };



    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: (      <input
                        type="checkbox"
                        checked={selectedOrders.length === allOrders.length}
                        onChange={toggleAllOrdersSelection}
                    /> ),
                    field: 'select',
                    sort: 'asc',

                },
                {
                    label: 'ORDER ID',
                    field: 'id',
                    sort: 'asc'
                },

                {
                    label: 'QUANTITY',
                    field: 'numofItems',
                    sort: 'asc'
                },
                {
                    label: 'AMOUNT',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'STATUS',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'ACTIONS',
                    field: 'actions',
                },
            ],
            rows: []
        }

        allOrders.forEach(order => {
            data.rows.push({

                select: (
                    <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => toggleOrderSelection(order._id)}
                    />
                ),


                id: order._id,
                numofItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                    ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                    actions: (
                        <div className="text-center">
                          <Link to={`/admin/order/${order._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-eye"></i>
                          </Link>
                          <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteOrderHandler(order._id)}>
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      )
            })
            // console.log(order)
        })
        return data;
    }


    const deleteOrderHandler2 = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            // Send a request to delete multiple materials
            const deleteRequests = selectedOrders.map(async (id) => {
                return axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/order/${id}`, config);
            });

            // Wait for all delete requests to complete
            const responses = await Promise.all(deleteRequests);

            // Check if all requests were successful
            const allSuccess = responses.every((response) => response.data.success);

            setIsDeleted(allSuccess);
            setLoading(false);
        } catch (error) {
            setDeleteError(error.response.data.message);
        }
    };


    return (
        <Fragment>
            <MetaData title={'All Orders'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10" style={{ paddingLeft: "70px", marginBottom: "70px" }}>
                    <Fragment>
                        <h1 className="my-5">All Orders</h1>
                        {loading ? <Loader /> : (
                             <div>
                            <div>
                            <button
                                className="btn btn-danger py-1 px-2 mb-2"
                                onClick={deleteOrderHandler2}
                                disabled={selectedOrders.length === 0}
                            >
                                Delete Selected
                            </button>
                            </div>
                            <MDBDataTable
                                data={setOrders()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                            </div>
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default OrdersList;