import React, { Fragment, useState, useEffect } from 'react'
import MetaData from '../../Layout/MetaData'
import Sidebar from '../Sidebar'
import { getToken } from '../../../utils/helpers';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';



const UpdatePhoto = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const [error, setError] = useState('')
    const [photo, setPhoto] = useState({})
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

    const getPhotoDetails =  async (id) => {
        try {
           const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/photo/${id}`)
           setPhoto(data.photo)
           setLoading(false)
           
        } catch (error) {
            setError(error.response.data.message)
            
        }
    }
      
    const updatePhoto = async (id, photoData)  => {
        try {
           
            const config = {
                headers: {
                    'Content-Type':   'multipart/form-data', 
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/photo/${id}`, photoData, config)
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
        if (photo && photo._id !== id) {
            getPhotoDetails(id)
        } else {
            setName(photo.name);
            setPrice(photo.price);
            setDescription(photo.description);
            setOldImages(photo.images)
        }
        if (error) {
            errMsg(error)
            
        }
        if (updateError) {
            errMsg(updateError);
           
        }
        if (isUpdated) {
            navigate('/admin/photos');
            successMsg('Photo updated successfully');
           
        }
    }, [error, isUpdated, updateError, photo, id])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('description', description);
        images.forEach(image => {
            formData.append('images', image)
        })
        updatePhoto(photo._id, formData)
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
        <MetaData title={'UPDATE PHOTO'} />
        <div className="row">
            <div className="col-12 col-md-2">
            <div style={{ display: 'flex', height: '106vh', overflow: 'scroll initial' }}>
    
                <Sidebar />
                </div>
            </div>
            <div className="col-12 col-md-8">
                <div className="wrapper my-5">
                    <form className="shadow-lg photoForm" onSubmit={submitHandler} encType='multipart/form-data' style={{ width: '100%', padding: '20px' }}>
                        <h1 className="mb-4 text-center">UPDATE PHOTO</h1>
                        <div className="form-group">
                            <label htmlFor="name_field">NAME</label>
                            <input
                                type="text"
                                id="name_field"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price_field">PRICE</label>
                            <input
                                type="text"
                                id="price_field"
                                className="form-control"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>IMAGES</label>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='avatar'
                                    className='custom-file-input'
                                    id='customFile'
                                    onChange={onChange}
                                    multiple
                                />
                                <label className='custom-file-label' htmlFor='customFile'>
                                    CHOOSE IMAGES
                                </label>
                            </div>
                            {oldImages && oldImages.map(img => (
                                <img key={img} src={img.url} alt={img.url} className="mt-3 mr-2" width="55" height="52" />
                            ))}
                            {imagesPreview.map(img => (
                                <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                            ))}
                        </div>
                        <button
                            id="login_button"
                            type="submit"
                            className="btn btn-block btn-primary py-3"
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

export default UpdatePhoto