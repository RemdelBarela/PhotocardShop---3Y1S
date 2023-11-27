import React, { Fragment, useState, useEffect } from 'react'
import MetaData from '../../Layout/MetaData'
import Sidebar from '../Sidebar'
import { getToken } from '../../../utils/helpers';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';

const UpdateReview = () => {
    const [photo, setPhoto] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const [error, setError] = useState('')
    const [review, setReview] = useState({})
    const [loading, setLoading] = useState(true)
    const [updateError, setUpdateError] = useState('')
    const [isUpdated, setIsUpdated] = useState(false)

    let { id } = useParams();
    let navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_RIGHT
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT
    });

    const getReviewDetails =  async (id) => {
        try {
           const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/review/${id}`)
           setReview(data.review)
           setLoading(false)
           
        } catch (error) {
            setError(error.response.data.message)
            
        }
    }
      
    const updateReview = async (id, reviewData)  => {
        try {
           
            const config = {
                headers: {
                    'Content-Type':   'multipart/form-data', 
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/review/${id}`, reviewData, config)
            setIsUpdated(data.success)
           
        } catch (error) {
            setUpdateError(error.response.data.message)
            if (error.response && error.response.status === 400 && error.response.data.errors) {
                // If the server returns validation errors, display them to the user
                const validationErrors = error.response.data.errors;
                validationErrors.forEach(errorMessage => {
                    toast.error(errorMessage, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                });
            } 
        }
    }
    useEffect(() => {
        if (review && review._id !== id) {
            getReviewDetails(id)
        } else {
            setPhoto(review.photo);
            setRating(review.rating);
            setComment(review.comment);
            setOldImages(review.images)
        }
        if (error) {
            errMsg(error)
            
        }
        if (updateError) {
            errMsg(updateError);
           
        }
        if (isUpdated) {
            navigate('/admin/reviews');
            successMsg('Review updated successfully');
           
        }
    }, [error, isUpdated, updateError, review, id])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('photo', photo);
        formData.set('rating', rating);
        formData.set('comment', comment);
        images.forEach(image => {
            formData.append('images', image)
        })
        updateReview(review._id, formData)
    }
    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([]);
        setImages([])
        setOldImages([])
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }
    return (
        <Fragment>
        <MetaData title={'UPDATE REVIEW'} />
        <div classPhoto="row">
            <div classPhoto="col-12 col-md-2">
            <div style={{ display: 'flex', height: '106vh', overflow: 'scroll initial' }}>
    
                <Sidebar />
                </div>
            </div>
            <div classPhoto="col-12 col-md-8">
                <div classPhoto="wrapper my-5">
                    <form classPhoto="shadow-lg reviewForm" onSubmit={submitHandler} encType='multipart/form-data' style={{ width: '100%', padding: '20px' }}>
                        <h1 classPhoto="mb-4 text-center">UPDATE REVIEW</h1>
                        <div classPhoto="form-group">
                            <label htmlFor="photo_field">PHOTO</label>
                            <input
                                type="text"
                                id="photo_field"
                                classPhoto="form-control"
                                value={photo}
                                onChange={(e) => setPhoto(e.target.value)}
                            />
                        </div>
                        <div classPhoto="form-group">
                            <label htmlFor="rating_field">RATING</label>
                            <input
                                type="text"
                                id="rating_field"
                                classPhoto="form-control"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            />
                        </div>
                        <div classPhoto='form-group'>
                            <label>IMAGES</label>
                            <div classPhoto='custom-file'>
                                <input
                                    type='file'
                                    photo='avatar'
                                    classPhoto='custom-file-input'
                                    id='customFile'
                                    onChange={onChange}
                                    multiple
                                />
                                <label classPhoto='custom-file-label' htmlFor='customFile'>
                                    CHOOSE IMAGES
                                </label>
                            </div>
                            {oldImages && oldImages.map(img => (
                                <img key={img} src={img.url} alt={img.url} classPhoto="mt-3 mr-2" width="55" height="52" />
                            ))}
                            {imagesPreview.map(img => (
                                <img src={img} key={img} alt="Images Preview" classPhoto="mt-3 mr-2" width="55" height="52" />
                            ))}
                        </div>
                        <button
                            id="login_button"
                            type="submit"
                            classPhoto="btn btn-block btn-primary py-3"
                            disabled={loading ? true : false}
                            style={{ marginTop: '20px' }}>
                            UPDATE
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </Fragment>
    
    )
}

export default UpdateReview