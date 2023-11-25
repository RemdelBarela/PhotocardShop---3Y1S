
import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import MetaData from '../../Layout/MetaData'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errMsg, successMsg } from '../../../utils/helpers';
import { getToken } from '../../../utils/helpers';
import axios from 'axios';
import Sidebar from '../Sidebar'

const UpdateUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);  // Initialize with null
    const [isUpdated, setIsUpdated] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const config = {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${getToken()}`
        }
    };

    const getUserDetails = async (id) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, config);
            setUser(data.user);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const updateUser = async (id, userData) => {
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, userData, config);
            setIsUpdated(data.success);
            setLoading(false);
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
        const fetchData = async () => {
            try {
                await getUserDetails(id);
            } catch (error) {
                // Handle error if needed
            }
        };

        if (!user || user._id !== id) {
            fetchData();
        } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }

        if (error) {
            errMsg(error);
            setError('');
        }

        if (isUpdated) {
            successMsg('USER INFORMATION UPDATED SUCCESSFULLY');
            navigate('/admin/users');
        }
    }, [id, user, error, isUpdated, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('role', role);
        updateUser(user._id, formData);
    };

    return (
        <Fragment>
            <MetaData title={`Update User`} />
            <div className="row">
                <div className="col-12 col-md-2">

                    <Sidebar />
                </div>
                <div className="col-12 col-md-10"style={{ marginBottom: '100px' }}>
                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mt-2 mb-4">USER INFORMATION UPDATE</h1>
                                <div className="form-group">
                                    <label htmlFor="name_field">NAME</label>
                                    <input
                                        type="name"
                                        id="name_field"
                                        className="form-control"
                                        name='name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ backgroundColor: 'rgba(128, 128, 128, 0.25)' }}
                                        readOnly
                                        disabled
                                    />  
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email_field">EMAIL</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ backgroundColor: 'rgba(128, 128, 128, 0.25)' }}
                                        readOnly
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role_field">ROLE</label>
                                    <select
                                        id="role_field"
                                        className="form-control"
                                        name='role'
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="user">USER</option>
                                        <option value="admin">ADMIN</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn update-btn btn-block mt-4 mb-4" id="upu">UPDATE</button>
                            </form>
                        </div>
                    </div>
                    </div>
                </div>
        </Fragment>
    )
}

export default UpdateUser