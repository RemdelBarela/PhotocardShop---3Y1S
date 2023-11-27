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

const NewReview = () => {
    const [photo, setPhoto] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [review, setReview] = useState({});
    
    
    let navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('photo', photo);
        formData.set('rating', rating);
        formData.set('comment', comment);
        images.forEach(image => {
            formData.append('images', image);
        });
        newReview(formData);
    };

    // const onChange = e => {
    //     const files = Array.from(e.target.files);
    //     setImagesPreview([]);
    //     setImages([]);
    //     files.forEach(file => {
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             if (reader.readyState === 2) {
    //                 setImagesPreview(oldArray => [...oldArray, reader.result]);
    //                 setImages(oldArray => [...oldArray, reader.result]);
    //             }
    //         };
    //         reader.readAsDataURL(file);
    //     });
    // };

    const newReview = async (reviewData) => {
        try {
            const config = {
                headers: {
                    'Content-Type':   'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/admin/review/new`, reviewData, config);
            setLoading(false);
            setSuccess(data.success);
            // setReview(data.review);
        } catch (error) {
            setError(error.response.data.message);

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
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (success) {
            navigate('/admin/reviews');
            toast.success('THE REVIEW IS ADDED SUCCESSFULLY', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }, [error, success]);

    return (
        <Fragment>
            <MetaData title={'NEW REVIEW'} />
            <div classPhoto="row">
            <div classPhoto="col-12 col-md-2">
            <div style={{  height: '130vh', overflow: 'scroll initial' }}>
                {/* <Sidebar /> */}
                </div>
            </div>
            <div classPhoto="col-12 col-md-8">
                <div classPhoto="wrapper my-5" style={{ width: '100%', paddingLeft: '10%', marginLeft: '10%' }}>
                <Fragment>
                        <form classPhoto="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data' style={{ width: '100%', margin: '0 auto' }}>
                            <h1 classPhoto="mb-4 text-center">CREATE NEW REVIEW</h1>

                            <div classPhoto="form-group">
                                <label htmlFor="photo_field">PHOTO</label>
                                <input
                                    type="text"
                                    id="photo_field"
                                    classPhoto="form-control"
                                    value={photo}
                                    label='First photo'
                                    placeholder='ENTER PHOTO'
                                    onChange={(e) => setPhoto(e.target.value)}
                                />
                            </div>

                            <div classPhoto="form-group">
                                <label htmlFor="rating_field">RATING</label>
                                <input
                                    type="text"
                                    id="rating_field"
                                    classPhoto="form-control"
                                    label='Rating'
                                    placeholder='ENTER RATING'
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                />
                            </div>

                            <div classPhoto="form-group">
                                <label htmlFor="comment_field">COMMENT</label>

                                <textarea
                                    classPhoto="form-control"
                                    id="comment_field"
                                    rows="8"
                                    placeholder="ENTER YOUR COMMENT HERE..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>

                            {/* <div classPhoto='form-group'>
                                <label>IMAGES</label>
                                <div classPhoto='custom-file'>
                                    <input
                                        type='file'
                                        photo='images'
                                        classPhoto='custom-file-input'
                                        id='customFile'
                                        accept="images/*"
                                        onChange={onChange}
                                        multiple
                                    />
                                    <label classPhoto='custom-file-label' htmlFor='customFile'>
                                        CHOOSE IMAGES
                                    </label>
                                </div>
                                <div classPhoto="image-preview-container mt-3">
                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" 
                                        classPhoto="mr-2" width="100" height="100" />
                                    ))}
                                </div>
                            </div> */}

                            <button
                                id="login_button"
                                type="submit"
                                classPhoto="btn btn-block btn-primary py-3"
                                style={{ marginTop: '20px' }}
                            >
                                SUBMIT
                            </button>
                        </form>
                        </Fragment>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default NewReview;
