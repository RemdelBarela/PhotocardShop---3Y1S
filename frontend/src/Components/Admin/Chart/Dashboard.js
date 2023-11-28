import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import MetaData from '../../Layout/MetaData'
import Loader from '../../Layout/Loader'
import Sidebar from '../Sidebar'
import { getToken } from '../../../utils/helpers';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserSalesChart from './UserSalesChart';
import PhotoSalesChart from './PhotoSalesChart';
import OrderStatusSalesChart from './OrderStatusSalesChart';
import RatingStatsChart from './RatingStatsChart';


const Dashboard = () => {

    const [photos, setPhotos] = useState([])
    const [error, setError] = useState('')
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    // const [reviews, setReviews] = useState([])
    const [materials, setMaterials] = useState([])
    const [loading, setLoading] = useState(true)
    // const [totalAmount, setTotalAmount] = useState([])
    // const [totalAmount, setTotalAmount] = useState(0);
    // let outOfStock = 0;
    // photos.forEach(photo => {
    //     if (photo.stock === 0) {
    //         outOfStock += 1;
    //     }
    // })

    const getAdminPhotos = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/photos`, config)
            console.log(data)
            setPhotos(data.photos)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)
           
        }
    }

    const listUsers = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/users`, config)
            setUsers(data.users)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)
            
        }
    }

    const getAdminMaterials = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/materials`, config);

            console.log(data);
            setMaterials(data.materials);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const listOrders = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/orders`, config)
            setOrders(data.orders)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        getAdminPhotos()
        listUsers()
        getAdminMaterials()
        listOrders()
    }, [])

    return (
        <Fragment>
             <MetaData title={'Dashboard'} />
            <div className="row">
                <div className="col-12 col-md-2">
                <Sidebar />
                </div>

                <div className="col-12 col-md-10" style={{  paddingLeft: "70px", marginBottom: "70px" }}>
                    <h1 className="my-4 text-center">DASHBOARD</h1>
                    <hr />
                    {loading ? <Loader /> : (
                        <Fragment>
                           


                            <div className="row pr-4 " style={{ margin: '3%' }}>
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white" style={{ backgroundColor: '#333' }}>
                                        <div className="card-body">
                                            <div className="text-center card-font-size">PHOTOS<br /> <b>{photos && photos.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/photos">
                                            <span className="float-left">VIEW DETAILS</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white" style={{ backgroundColor: '#000' }}>

                                        <div className="card-body">
                                            <div className="text-center card-font-size">MATERIALS<br /> <b>{materials && materials.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/materials">
                                            <span className="float-left">VIEW DETAILS</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white" style={{ backgroundColor: '#C00' }}>

                                        <div className="card-body">
                                            <div className="text-center card-font-size">ACCOUNTS<br /> <b>{users && users.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                            <span className="float-left">VIEW DETAILS</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white" style={{ backgroundColor: '#F00' }}>

                                        <div className="card-body">
                                            <div className="text-center card-font-size">ORDERS<br /> <b>{orders && orders.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                            <span className="float-left">VIEW DETAILS</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )}<hr />
               

                    <div className="col-12 col-md-10 my-4" style={{ marginLeft: '28%' }}>
                        <Fragment>
                            <h1 style={{ marginLeft: '20%' }}>CUSTOMER SALES CHART</h1>
                            <UserSalesChart /><br /> <br />
                        </Fragment>
                        <Fragment>
                            <h1 style={{ marginLeft: '27%' }}>ORDER STATUS</h1>
                            <OrderStatusSalesChart /> <br /> <br />
                        </Fragment>
                        <Fragment>
                            <h1 style={{ marginLeft: '20%' }}>RATING REVIEWS CHART</h1>
                            <RatingStatsChart /> <br /> <br />
                        </Fragment> 
                    </div>
                    </div >
            </div>
        </Fragment >
    )
}

export default Dashboard