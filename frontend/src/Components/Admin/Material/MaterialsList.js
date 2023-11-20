import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from '../Sidebar'
import MetaData from '../../Layout/MetaData'
// import Sidebar from './SideBar'
import { getToken } from '../../../utils/helpers';
import Loader from '../../Layout/Loader'

const MaterialsList = () => {
    const [materials, setMaterials] = useState([])
    const [error, setError] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const [users, setUsers] = useState([])
    // const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [isDeleted, setIsDeleted] = useState(false)

    let navigate = useNavigate()
    const getAdminMaterials = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/materials`, config)
            console.log(data)
            setMaterials(data.materials)
            setLoading(false)
        } catch (error) {

            setError(error.response.data.message)

        }
    }
    useEffect(() => {
        getAdminMaterials()

        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (deleteError) {
            toast.error(deleteError, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (isDeleted) {
            toast.success('MATERIAL DELETED SUCCESSFULLY', {
                position: toast.POSITION.BOTTOM_RIGHT
            })
            navigate('/admin/materials');
            
            setIsDeleted(false)
            setDeleteError('')

        }

    }, [error, deleteError, isDeleted,])

    const deleteMaterial = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/material/${id}`, config)

            setIsDeleted(data.success)
            setLoading(false)
        } catch (error) {
            setDeleteError(error.response.data.message)

        }
    }

    const materialsList = () => {
        const data = {
            columns: [
                {
                    label: 'Material ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Images',
                    field: 'images',
                    sort: 'asc'
                },
                {
                    label: 'Material Name',
                    field: 'name',
                    sort: 'asc',
                    
                },
                {
                    label: 'Stock',
                    field: 'stock',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        materials.forEach(material => {
            data.rows.push({
                id: material._id,
                images: material.images.map((image, index) => (
                    <img key={index} src={image.url} alt={`Image ${index}`} style={{ width: '50px', height: '50px' }} />
                  )),
                name: material.name,
                // price: `$${photo.price}`,
                stock: material.stock,
                actions: <Fragment>
                    <Link to={`/admin/material/${material._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pen"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteMaterialHandler(material._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })

        return data;
    }

    const deleteMaterialHandler = (id) => {
        deleteMaterial(id)
    }

    return (
        <Fragment>
            <MetaData title={'All Materials'} />
            <div className="row">
                <div className="col-12 col-md-2">
                <div style={{  height: '210vh', overflow: 'scroll initial' }}>
                        <Sidebar />
                    </div>
                </div>

                <div className="col-12 col-md-8">
                    <div className="wrapper my-5">
                        <Fragment>
                        <div style={{ width: '100%', paddingLeft: '5%', margin: '0 auto'}} >
                                <h1 className="my-5">LIST OF ALL MATERIALS</h1>
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <MDBDataTable
                                        data={materialsList()}
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
    );
}

export default MaterialsList