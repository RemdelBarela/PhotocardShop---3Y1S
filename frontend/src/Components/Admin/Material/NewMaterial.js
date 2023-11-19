import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetaData from '../../Layout/MetaData';
import { getToken } from '../../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Sidebar'
const NewMaterial = () => {
    const [name, setName] = useState('');
    const [stock, setStock] = useState(0);
    // const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [material, setMaterial] = useState({});
    
    let navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('stock', stock);
        // formData.set('description', description);
        images.forEach(image => {
            formData.append('images', image);
        });
        newMaterial(formData);
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

    const newMaterial = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/admin/material/new`, formData, config);
            setLoading(false);
            setSuccess(data.success);
            setMaterial(data.material);
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
            navigate('/admin/materials');
            toast.success('THE MATERIAL IS ADDED SUCCESSFULLY', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }, [error, success]);

    return (
        <Fragment>
            <MetaData title={'New Material'} />
            <div className="row">

            <div className="col-12 col-md-2">
            <div style={{  height: '210vh', overflow: 'scroll initial' }}>
                <Sidebar />
                </div>
            </div>
                <div className="np col-12 col-md-8">
                    <div className="np wrapper my-5">
                        <Fragment>
                        <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data' style={{ width: '100%', paddingLeft: '15%', margin: '0 auto' }}>
                            <h1 className="mb-4 text-center">CREATE NEW MATERIAL</h1>

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
                                <div className="image-preview-container mt-3">
                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mr-2" width="100" height="100" />
                                    ))}
                                </div>
                            </div>

                            <button
                                id="create_button"
                                type="submit"
                                className="btn btn-block btn-primary py-3"
                                style={{ marginTop: '20px' }}
                            >
                                CREATE
                            </button>
                        </form>
                        </Fragment>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default NewMaterial;
