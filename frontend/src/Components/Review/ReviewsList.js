import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers'
import Sidebar from '../Admin/Sidebar'

const ReviewsList = () => {
    const [reviews, setReviews] = useState([])
    const [error, setError] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [isDeleted, setIsDeleted] = useState(false)
    const [selectedReviews, setSelectedReviews] = useState([]);

    let navigate = useNavigate()
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
        getAdminReviews()

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
            toast.success('REVIEW/S DELETED SUCCESSFULLY', {
                position: toast.POSITION.BOTTOM_RIGHT
            })
            navigate('/admin/reviews');
            
            setIsDeleted(false)
            setDeleteError('')

        }

    }, [error, deleteError, isDeleted,])

    const deleteReview = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/review/${id}`, config)

            setIsDeleted(data.success)
            setLoading(false)
        } catch (error) {
            setDeleteError(error.response.data.message)

        }
    }

    const toggleAllReviewsSelection = () => {
        if (selectedReviews.length === reviews.length) {
            // If all materials are selected, unselect all
            setSelectedReviews([]);
        } else {
            // Otherwise, select all materials
            setSelectedReviews(reviews.map((reviews) => reviews._id));
        }
    };

    const toggleReviewSelection = (id) => {
        const isSelected = selectedReviews.includes(id);
        if (isSelected) {
            setSelectedReviews(selectedReviews.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedReviews([...selectedReviews, id]);
        }
    };


    const reviewsList = () => {
        const data = {
            columns: [
                {
                    label: (      <input
                        type="checkbox"
                        checked={selectedReviews.length === reviews.length}
                        onChange={toggleAllReviewsSelection}
                    />
                ),
                    field: 'select',
                    sort: 'asc',
                },                {
                    label: 'REVIEW ID',
                    field: 'reviewId',
                    sort: 'asc',
                },
                {
                    label: 'PHOTO ID',
                    field: 'photoId',
                    sort: 'asc',
                },
                {
                    label: 'NAME',
                    field: 'name',
                    sort: 'asc',
                },
                {
                    label: 'Images',
                    field: 'images',
                    sort: 'asc',
                },
                {
                    label: 'RATING',
                    field: 'rating',
                    sort: 'asc',
                },
                {
                    label: 'COMMENT',
                    field: 'comment',
                    sort: 'asc',
                },
                {
                    label: 'ACTIONS',
                    field: 'actions',
                },
            ],
            rows: []
        };

        reviews.forEach(review => {
            data.rows.push({
                select: (
                    <input
                        type="checkbox"
                        checked={selectedReviews.includes(review._id)}
                        onChange={() => toggleReviewSelection(review._id)}
                    />
                ),
                reviewId: review._id,
                photoId: review.photo,
                name: review.name,
                images: review.images.map((image, index) => (
                    <img key={index} src={image.url} alt={`Image ${index}`} style={{ width: '50px', height: '50px' }} />
                )),
                rating: review.rating,
                comment: review.comment,
                actions: (
                    <Fragment>
                        <Link to={`/photo/${review.photo}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pen"></i>
                        </Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteReviewHandler(review._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>
                )
            });
        });

        return data;
    };

    const deleteReviewHandler = (id) => {
        deleteReview(id)
    }


    const deleteReviewHandler2 = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            // Send a request to delete multiple materials
            const deleteRequests = selectedReviews.map(async (id) => {
                return axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/review/${id}`, config);
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
            <MetaData title={'All Reviews'} />
            <div className="row">
                <div className="col-12 col-md-2">
                <Sidebar />
                </div>
           
                <div className="col-12 col-md-10" style={{  paddingLeft: "70px", marginBottom: "70px" }}>
                <Fragment>
              <h1 className="my-5 text-center">All Reviews</h1>

                        {loading ? <Loader /> : (
                            <div>
                                   <div>
                                <button
                                    className="btn btn-danger py-1 px-2 mb-2"
                                    onClick={deleteReviewHandler2}
                                    disabled={selectedReviews.length === 0}
                                >
                                    Delete Selected
                                </button>
                            </div>
                            <MDBDataTable
                                data={reviewsList()}
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
    )
}

export default ReviewsList