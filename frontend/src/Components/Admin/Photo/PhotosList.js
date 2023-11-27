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
    const [selectedPhotos, setSelectedPhotos] = useState([]);

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

    const togglePhotoSelection = (id) => {
        const isSelected = selectedPhotos.includes(id);
        if (isSelected) {
            setSelectedPhotos(selectedPhotos.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedPhotos([...selectedPhotos, id]);
        }
    };



    const toggleAllPhotosSelection = () => {
        if (selectedPhotos.length === photos.length) {
            // If all materials are selected, unselect all
           setSelectedPhotos([]);
        } else {
            // Otherwise, select all materials
            setSelectedPhotos(photos.map((photos) => photos._id));
        }
    };


    const photosList = () => {
        const data = {
            columns: [
                {
                    label: (      <input
                        type="checkbox"
                        checked={selectedPhotos.length === photos.length}
                        onChange={toggleAllPhotosSelection}
                    /> ),
                    field: 'select',
                    sort: 'asc',
                },
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Images',
                    field: 'images',
                    sort: 'asc',
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        };

        photos.forEach(photo => {
            data.rows.push({
                select: (
                    <input
                        type="checkbox"
                        checked={selectedPhotos.includes(photo._id)}
                        onChange={() => togglePhotoSelection(photo._id)}
                    />
                ),
                id: photo._id,
                images: photo.images.map((image, index) => (
                    <img key={index} src={image.url} alt={`Image ${index}`} style={{ width: '50px', height: '50px' }} />
                )),
                name: photo.name,
                price: `$${photo.price}`,
                stock: photo.stock,
                actions: (
                    <div className='text-center'>
                        <Link to={`/admin/photo/${photo._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pen"></i>
                        </Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deletePhotoHandler(photo._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </div>
                )
            });
        });

        return data;
    };

    const deletePhotoHandler = (id) => {
        deletePhoto(id)
    }


    const deletePhotoHandler2 = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            // Send a request to delete multiple materials
            const deleteRequests = selectedPhotos.map(async (id) => {
                return axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/photo/${id}`, config);
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
          <MetaData title={'All Photos'} />
          <div className="row">
            <div className="col-12 col-md-2">
              <Sidebar />
            </div>
            <div className="col-12 col-md-10" style={{  paddingLeft: "70px", marginBottom: "70px" }}>
              <Fragment>
              <h1 className="my-5">All Photos</h1>
              {loading ?  <Loader />  : (
                <div>
                  <div>
                    <button
                      className="btn btn-danger py-1 px-2 mb-1"
                      onClick={deletePhotoHandler2}
                      disabled={selectedPhotos.length === 0}
                    >
                      Delete Selected
                    </button>
                  </div>
                  <MDBDataTable
                    data={photosList()}
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

export default PhotosList