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
import { FaRegMehBlank } from 'react-icons/fa';
// ... (your existing imports)

const MaterialsList = () => {
    const [materials, setMaterials] = useState([]);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);
    const [selectedMaterials, setSelectedMaterials] = useState([]);

    let navigate = useNavigate();

    const toggleMaterialSelection = (id) => {
        const isSelected = selectedMaterials.includes(id);
        if (isSelected) {
            setSelectedMaterials(selectedMaterials.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedMaterials([...selectedMaterials, id]);
        }
    };

   
    const getAdminMaterials = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/materials`, config);

            console.log(data);
            setMaterials(data.materials);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        getAdminMaterials();

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
            });
            navigate('/admin/materials');
            setIsDeleted(false);
            setDeleteError('');
        }
    }, [error, deleteError, isDeleted]);


    const toggleAllMaterialsSelection = () => {
        if (selectedMaterials.length === materials.length) {
            // If all materials are selected, unselect all
            setSelectedMaterials([]);
        } else {
            // Otherwise, select all materials
            setSelectedMaterials(materials.map((material) => material._id));
        }
    };

    
    const deleteMaterial = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/material/${id}`, config);

            setIsDeleted(data.success);
            setLoading(false);
        } catch (error) {
            setDeleteError(error.response.data.message);
        }
    };

    const materialsList = () => {
        const data = {
            columns: [
                {
                    label: (      <input
                        type="checkbox"
                        checked={selectedMaterials.length === materials.length}
                        onChange={toggleAllMaterialsSelection}
                    />
                ),
                    field: 'select',
                    sort: 'asc',
                },
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
        };

        materials.forEach(material => {
            data.rows.push({
                select: (
                    <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material._id)}
                        onChange={() => toggleMaterialSelection(material._id)}
                    />
                ),
                id: material._id,
                images: material.images.map((image, index) => (
                    <img key={index} src={image.url} alt={`Image ${index}`} style={{ width: '50px', height: '50px' }} />
                )),
                name: material.name,
                stock: material.stock,
                actions: <Fragment>
                        <Link to={`/admin/material/${material._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pen"></i>
                        </Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteMaterialHandler(material._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>
                
            });
        });

        return data;
    };

    const deleteMaterialHandler = (id) => {
        deleteMaterial(id);
    };

    // const deleteMaterialHandler = () => {
    //     // Use the first selected material for deletion
    //     const id = selectedMaterials[0];
    //     if (id) {
    //         deleteMaterial(id);
    //     }
    // };


    const deleteMaterialHandler2 = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            // Send a request to delete multiple materials
            const deleteRequests = selectedMaterials.map(async (id) => {
                return axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/material/${id}`, config);
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
        <MetaData title={'All Materials'} />
        <div className="row">
            <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
            <div className="col-12 col-md-10" style={{  paddingLeft: "70px", marginBottom: "70px" }}>
                <Fragment>
                        <h1 className="my-5">LIST OF ALL MATERIALS</h1>
                        {loading ? (
                            <Loader />
                        ) : (
                            <div>
                            <div>
                                <button
                                    className="btn btn-danger py-1 px-2 mb-2"
                                    onClick={deleteMaterialHandler2}
                                    disabled={selectedMaterials.length === 0}
                                >
                                    Delete Selected
                                </button>
                            </div>
                            <MDBDataTable data={materialsList()} className="px-3" bordered striped hover />
                    
                        </div>
                    )}
                    </Fragment>
                </div>
            </div>
    </Fragment>
    );
};

export default MaterialsList;
