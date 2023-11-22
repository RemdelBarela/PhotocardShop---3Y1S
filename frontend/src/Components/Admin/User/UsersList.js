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
    let navigate = useNavigate();
    const config = {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${getToken()}`
        }
    }
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
        const response = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, config);
        console.log(response); // Log the response
      
        if (response && response.data) {
            setIsDeleted(response.data.success);
            setLoading(false);
        } else {
            console.error("Unexpected response structure:", response);
        }
    } catch (error) {
        setError(error.response?.data?.message || 'An error occurred');
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
    return (
        <Fragment>
            <MetaData title={'All Users'} />
            <div className="row">
                <div className="col-12 col-md-2">
                <div style={{  height: '210vh', overflow: 'scroll initial' }}>
                        <Sidebar />
                    </div>
                </div>
                <div className="col-12 col-md-10">
                    <div className="wrapper my-5">
                    <Fragment>
                    <div style={{ width: '100%', paddingLeft: '5%', margin: '0 auto'}} >
                        <h1 className="my-5">LIST OF ALL USERS</h1>
                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setUsers()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                         
                        )}
                           </div>
                    </Fragment>
                </div>
                </div>
            </div>
        </Fragment>
    )
}

export default UsersList