import React, { Fragment, useState, useEffect } from 'react'
import MetaData from '../../Layout/MetaData'
// import Sidebar from './SideBar'
import { getToken } from '../../../utils/helpers';

import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';

const UpdateMaterial = () => {;
    const [name, setName] = useState('');
    const [stock, setStock] = useState(0);
    // const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const [error, setError] = useState('')
    const [material, setMaterial] = useState({})
    const [loading, setLoading] = useState(true)
    const [updateError, setUpdateError] = useState('')
    const [isUpdated, setIsUpdated] = useState(false)

    let { id } = useParams();
    let navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const getMaterialDetails =  async (id) => {
        try {
           const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/material/${id}`)
           setMaterial(data.material)
           setLoading(false)
           
        } catch (error) {
            setError(error.response.data.message)

        }
    }
      
    const updateMaterial = async (id, materialData)  => {
        try {
           
            const config = {
                headers: {
                    'Content-Type':   'multipart/form-data', 
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/material/${id}`, materialData, config)
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
        if (material && material._id !== id) {
            getMaterialDetails(id)
        } else {
            setName(material.name);
            setStock(material.stock);
            // setDescription(material.description);
            setOldImages(material.images)
        }
        if (error) {
            errMsg(error)
            
        }
        if (updateError) {
            errMsg(updateError);
           
        }
        if (isUpdated) {
            navigate('/admin/materials');
            successMsg('MATERIALS SUCCESSFULLY UPDATED');
        }
    }, [error, isUpdated, updateError, material, id])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('stock', stock);
        // formData.set('description', description);
        images.forEach(image => {
            formData.append('images', image)
        })
        updateMaterial(material._id, formData)
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
            <MetaData title={'Update Material'} />
            <div className="row">
                {/* <div className="col-12 col-md-2">
                    <Sidebar />
                </div> */}
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">UPDATE MATERIAL</h1>
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
                                    <label htmlFor="stock_field">STOCK</label>
                                    <input
                                        type="text"
                                        id="stock_field"
                                        className="form-control"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label>IMAGES</label>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='images'
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
                                    className="btn btn-block py-3"
                                    disabled={loading ? true : false}
                                >
                                    UPDATE
                                </button>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateMaterial