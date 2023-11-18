import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MetaData from '../../Layout/MetaData'
// import Sidebar from './SideBar'
import { getToken } from '../../../utils/helpers';
import Loader from '../../Layout/Loader'

const PhotosList = () => {
    const [photos, setPhotos] = useState([])
    const [error, setError] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [isDeleted, setIsDeleted] = useState(false)

    let navigate = useNavigate()
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
    useEffect(() => {
        getAdminPhotos()

        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (deleteError) {
            toast.error(deleteError, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (isDeleted) {
            toast.success('Photo deleted successfully', {
                position: toast.POSITION.BOTTOM_RIGHT
            })
            navigate('/admin/photos');
            
            setIsDeleted(false)
            setDeleteError('')

        }

    }, [error, deleteError, isDeleted,])

    const deletePhoto = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/photo/${id}`, config)

            setIsDeleted(data.success)
            setLoading(false)
        } catch (error) {
            setDeleteError(error.response.data.message)

        }
    }



    const photosList = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                    
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        photos.forEach(photo => {
            data.rows.push({
                id: photo._id,
                name: photo.name,
                price: `$${photo.price}`,
                stock: photo.stock,
                actions: <Fragment>
                    <Link to={`/admin/photo/${photo._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deletePhotoHandler(photo._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })

        return data;
    }

    const deletePhotoHandler = (id) => {
        deletePhoto(id)
    }

    return (
        <Fragment>
            <MetaData title={'All Photos'} />
            <div className="row">
                {/* <div className="col-12 col-md-2">
                    <Sidebar />
                </div> */}

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Photos</h1>

                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={photosList()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}

                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default PhotosList