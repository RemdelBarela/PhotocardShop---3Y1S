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
import MaterialSalesChart from './MaterialSalesChart';
import PhotoSalesChart from './PhotoSalesChart';

const Dashboard = () => {

    const [photos, setPhotos] = useState([])
    const [error, setError] = useState('')
    const [users, setUsers] = useState([])
    const [reviews, setReviews] = useState([])
    const [materials, setMaterials] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalAmount, setTotalAmount] = useState([])
    let outOfStock = 0;
    photos.forEach(photo => {
        if (photo.stock === 0) {
            outOfStock += 1;
        }
    })

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

    const getAdminReviews = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/reviews`, config)
            console.log(data)
            setReviews(data.reviews)
            setLoading(false)
        } catch (error) {

            setError(error.response.data.message)

        }
    }


    useEffect(() => {
        getAdminPhotos()
        listUsers()
        getAdminMaterials()
        getAdminReviews()
    }, [])

    return (
        <Fragment>
            <div className="row">
                <div className="col-12 col-md-2">
                    {/* <Sidebar /> */}
                </div>

                <div className="col-12 col-md-10">
                    <h1 className="my-4">Dashboard</h1>

                    {loading ? <Loader /> : (
                        <Fragment>
                            <MetaData title={'Admin Dashboard'} />

                            <div className="row pr-4">
                                <div className="col-xl-12 col-sm-12 mb-3">
                                    <div className="card text-white bg-primary o-hidden h-100">
                                        <div className="card-body">
                                            {/* <div className="text-center card-font-size">Total Amount<br /> <b>${totalAmount && totalAmount.toFixed(2)}</b>
                                            </div> */}

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row pr-4">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-success o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Photos<br /> <b>{photos && photos.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/photos">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-danger o-hidden h-100">

                                        <div className="card-body">
                                            <div className="text-center card-font-size">Materials<br /> <b>{materials && materials.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/materials">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-info o-hidden h-100">

                                        <div className="card-body">
                                            <div className="text-center card-font-size">Accounts<br /> <b>{users && users.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-warning o-hidden h-100">

                                        <div className="card-body">
                                            <div className="text-center card-font-size">Reviews<br /> <b>{reviews && reviews.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                            <span className="float-left">View Details</span>
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
                    )}
                </div>
                <Fragment>
                        <UserSalesChart />
                    </Fragment>
                    <Fragment>
                        <MaterialSalesChart />
                    </Fragment>
                    <Fragment>
                        {/* <PhotoSalesChart /> */}
                    </Fragment>
            </div>
        </Fragment >
    )
}

export default Dashboard