import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import MetaData from '../../Layout/MetaData'
import Loader from '../../Layout/Loader'
// import Sidebar from '../SideBar'
import { getToken } from '../../../utils/helpers';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserSalesChart from './UserSalesChart';
import PhotoSalesChart from './PhotoSalesChart';
import MaterialSalesChart from './MaterialSalesChart';

const Dashboard = () => {

    const [photos, setPhotos] = useState([])
    const [error, setError] = useState('')
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    // const [reviews, setReviews] = useState([])
    const [materials, setMaterials] = useState([])
    const [loading, setLoading] = useState(true)
    // const [totalAmount, setTotalAmount] = useState([])
    const [totalAmount, setTotalAmount] = useState(0);
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
            <div className="row">
                <div className="col-12 col-md-2">
                    {/* <Sidebar /> */}
                </div>

                <div className="col-12 col-md-10">
                    <h1 className="my-4 text-center">DASHBOARD</h1>
                    <hr />
                    {loading ? <Loader /> : (
                        <Fragment>
                            <MetaData title={'Admin Dashboard'} />

                            <div className="row pr-4">
                                <div className="col-xl-12 col-sm-12 mb-3">
                                    <div className="card text-white bg-secondary o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">TOTAL AMOUNT<br /> <b>₱ {totalAmount && totalAmount.toFixed(2)}</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row pr-4">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-success o-hidden h-100">
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
                                    <div className="card text-white bg-danger o-hidden h-100">

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
                                    <div className="card text-white bg-info o-hidden h-100">

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
                                    <div className="card text-white bg-warning o-hidden h-100">

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

                                {/* <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-warning o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Out of Stock<br /> <b>0</b></div>
                                        </div>

                                        <div className="card-body">
                                            <div className="text-center card-font-size">Out of Stock<br /> <b>{outOfStock}</b></div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </Fragment>
                        
                    )}<hr />
                    
                </div>
                <Fragment>
                        <UserSalesChart />
                    </Fragment>
                    <Fragment>
                        
                        <MaterialSalesChart />
                    </Fragment>
                    <Fragment>
                       
                        <PhotoSalesChart /> 
                    </Fragment>
            </div>
        </Fragment >
    )
}

export default Dashboard