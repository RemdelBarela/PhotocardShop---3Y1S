import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetaData from '../../Layout/MetaData';
import { getToken } from '../../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Sidebar'
const NewPhoto = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [photo, setPhoto] = useState({});
    
    let navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('description', description);
        images.forEach(image => {
            formData.append('images', image);
        });
        newPhoto(formData);
    };

    const onChange = e => {
        const files = Array.from(e.target.files);
        setImagesPreview([]);
        setImages([]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                    setImages(oldArray => [...oldArray, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const newPhoto = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/admin/photo/new`, formData, config);
            setLoading(false);
            setSuccess(data.success);
            setPhoto(data.photo);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (success) {
            navigate('/admin/photos');
            toast.success('THE PHOTO IS ADDED SUCCESSFULLY', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }, [error, success]);

    return (
        <Fragment>
            <MetaData title={'NEW PHOTO'} />
            <div className="row">
            <div className="col-12 col-md-2">
            <div style={{  height: '130vh', overflow: 'scroll initial' }}>
                <Sidebar />
                </div>
            </div>
            <div className="col-12 col-md-8">
                <div className="wrapper my-5" style={{ width: '100%', paddingLeft: '10%', marginLeft: '10%' }}>
                <Fragment>
                        <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data' style={{ width: '100%', margin: '0 auto' }}>
                            <h1 className="mb-4 text-center">CREATE NEW PHOTO</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">NAME</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    value={name}
                                    label='First name'
                                    placeholder='ENTER NAME'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price_field">PRICE</label>
                                <input
                                    type="text"
                                    id="price_field"
                                    className="form-control"
                                    label='Price'
                                    placeholder='ENTER PRICE'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description_field">DESCRIPTION</label>

                                <textarea
                                    className="form-control"
                                    id="description_field"
                                    rows="8"
                                    placeholder="ENTER YOUR DESCRIPTION HERE..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
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
                                <div className="image-preview-container mt-3">
                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mr-2" width="100" height="100" />
                                    ))}
                                </div>
                            </div>

                            <button
                                id="login_button"
                                type="submit"
                                className="btn btn-block btn-primary py-3"
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

export default NewPhoto;
