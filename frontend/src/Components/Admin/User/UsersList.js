import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MetaData from '../../Layout/MetaData'
import Loader from '../../Layout/Loader'
import Sidebar from '../Sidebar'
import { errMsg, successMsg } from '../../../utils/helpers';
import axios from 'axios';
import { getToken } from '../../../utils/helpers';

const UsersList = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [allUsers, setAllUsers] = useState([])
    const [isDeleted, setIsDeleted] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [deleteError, setDeleteError] = useState('');
   
    let navigate = useNavigate();
    const config = {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${getToken()}`
        }
    }


    const toggleUserSelection = (id) => {
        const isSelected = selectedUsers.includes(id);
        if (isSelected) {
            setSelectedUsers(selectedUsers.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };


    
    const listUsers = async () => {
        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/users`, config)
            setAllUsers(data.users)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)
            
        }
    }

    const deleteUser = async (id) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        }
        const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, config);
       
            setIsDeleted(data.success);
            setLoading(false);
        
    } catch (error) {
        setError(error.response.data.message);
    }
}


    useEffect(() => {
        listUsers();
        if (error) {
            errMsg(error);
            setError('')
        }
        if (isDeleted) {
            successMsg('USER ACCOUNT DELETED');
            navigate('/admin/users');
        }

    }, [error, isDeleted,])


    const deleteUserHandler = (id) => {
       deleteUser(id)
    }
    
    const setUsers = () => {
        const data = {
            columns: [
                {
                    checkbox: true,
                    field: 'select',
                    sort: 'asc',
                },
                {
                    label: 'User ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Avatars',
                    field: 'avatar',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Role',
                    field: 'role',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }
        allUsers.forEach(user => {
            data.rows.push({

                select: (
                    <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                    />
                ),

                id: user._id,
                avatar: user.avatar.map((avatars, index) => (
                    <img key={index} src={avatars.url} alt={`Avatar ${index}`} style={{ width: '50px', height: '50px' }} />
                  )),
                name: user.name,
                email: user.email,
                role: user.role,
                actions: <Fragment>
                    <Link to={`/admin/user/${user._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pen"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteUserHandler(user._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })
        return data;
    }

    const deleteUserHandler2 = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            // Send a request to delete multiple materials
            const deleteRequests = selectedUsers.map(async (id) => {
                return axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, config);
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
            <MetaData title={'All Users'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10" style={{  paddingLeft: "70px", marginBottom: "70px" }}>
                    <Fragment>
                        <h1 className="my-5">LIST OF ALL USERS</h1>
                        {loading ? <Loader /> : (
                            <div>
                                <div>
                                    <button
                                        className="btn btn-danger py-1 px-2 mb-2"
                                        onClick={deleteUserHandler2}
                                        disabled={selectedUsers.length === 0}
                                    >
                                        Delete Selected
                                    </button>
                                </div>
                                <MDBDataTable
                                    data={setUsers()}
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

export default UsersList