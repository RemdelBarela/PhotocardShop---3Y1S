import React, { Fragment, useState, useEffect } from 'react'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../../Layout/MetaData'
import Sidebar from '../Sidebar'
import Loader from '../../Layout/Loader'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'
import { getUser, getToken, } from '../../../utils/helpers'
import axios from 'axios'


const PhotoReviews = () => {
    const [photoId, setPhotoId] = useState('')
    const [error, setError] = useState('')
    const [listReviews, setListReviews] = useState([])
    const [deleteError, setDeleteError] = useState('')
    const [isDeleted, setIsDeleted] = useState(false)
    const [user, setUser] = useState(getUser())
   
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    }

    const getPhotoReviews = async (id) => {
        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/reviews?id=${id}`, config)
            setListReviews(data.reviews)

        } catch (error) {
            setError(error.response.data.message)
        }
    }
    
    const deleteReview = async (id, photoId) => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/reviews?id=${id}&photoId=${photoId}`, config)
            setIsDeleted(data.success)

        } catch (error) {
            setDeleteError(error.response.data.message);
        }
    }

    const deleteReviewHandler = (id) => {
        Swal.fire({
            title: 'Delete User',
            icon: 'info',
            text: 'CONFIRM USER DELETION?',
            confirmButtonText: 'Delete',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                deleteReview(id, photoId)
            }
        })

    }
    useEffect(() => {
        if (error) {
            toast('UNABLE TO RETRIEVE REVIEWS. AN ERROR OCCURRED.', 'error')
            setError('')
        }

        if (deleteError) {
            toast(deleteError, 'error');
            setDeleteError('')
        }

        if (photoId !== '') {
            getPhotoReviews(photoId)
        }

        if (isDeleted) {
            toast('REVIEW SUCCESSFULLY REMOVED', 'success');
            setIsDeleted(false)
        }
    }, [error, photoId, isDeleted, deleteError])

    const submitHandler = (e) => {
        e.preventDefault();
        getPhotoReviews(photoId)
    }

    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: 'Review ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc'
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc'
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        listReviews.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.name,

                actions:
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteReviewHandler(review._id)}>
                        <i className="fa fa-trash"></i>
                    </button>

            })
        })
        return data;
    }

    return (
        <Fragment>
            <MetaData title={'Product Reviews'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="row justify-content-center mt-5">
                            <div className="col-5">
                                <form onSubmit={submitHandler}>
                                    <div className="form-group">
                                        <label htmlFor="photoId_field">Enter Photo ID</label>
                                        <input
                                            type="text"
                                            id="photoId_field"
                                            className="form-control"
                                            value={photoId}
                                            onChange={(e) => setPhotoId(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        id="search_button"
                                        type="submit"
                                        className="btn btn-primary btn-block py-2"
                                    >
                                        SEARCH
                                    </button>
                                </ form>
                            </div>
                        </div>
                        {listReviews && listReviews.length > 0 ? (
                            <MDBDataTable
                                data={setReviews()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        ) : (
                            <p className="mt-5 text-center">No Reviews.</p>
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default PhotoReviews