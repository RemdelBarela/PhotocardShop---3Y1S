import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MetaData from '../../Layout/MetaData'
import Sidebar from '../Sidebar'
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
            toast.success('PHOTO DELETED SUCCESSFULLY', {
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
                    label: 'Photo ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Images',
                    field: 'images',
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
                images: photo.images.map((image, index) => (
                    <img key={index} src={image.url} alt={`Image ${index}`} style={{ width: '50px', height: '50px' }} />
                  )),
                name: photo.name,
                price: `$${photo.price}`,
                actions: <Fragment>
                    <Link to={`/admin/photo/${photo._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pen"></i>
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
            <MetaData title={'ALL PHOTOS'} />
            <div className="row" id="photolist">
                <div className="col-12 col-md-2">
                <div style={{  height: '210vh', overflow: 'scroll initial' }}>
    
                    <Sidebar />
                    </div>
                </div>

                <div className="col-12 col-md-8">
                <div className="wrapper my-5">
                <Fragment>
                <div style={{ width: '100%', paddingLeft: '5%', margin: '0 auto'}} >
                        <h1 className="my-5">LIST OF ALL PHOTOS</h1>
                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={photosList()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}
                    </div>
                    </Fragment>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default PhotosList