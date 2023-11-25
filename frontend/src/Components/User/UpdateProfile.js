import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../Layout/MetaData';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';

const UpdateProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldAvatar, setOldAvatar] = useState([]);
  const [avatar, setAvatar] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState([]); // Ensure initialization here
  const [error, setError] = useState('');
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [updateError, setUpdateError] = useState('')
  const [isUpdated, setIsUpdated] = useState(false);

  let navigate = useNavigate();

  const config = {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  };

  const errMsg = (message = '') => toast.error(message, { 
    position: toast.POSITION.BOTTOM_RIGHT });
  const successMsg = (message = '') => toast.success(message, { 
    position: toast.POSITION.BOTTOM_RIGHT });

  const getProfile = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/me/`, config);
      setUser(data.user);
      setName(data.user.name);
      setEmail(data.user.email);
      setOldAvatar(data.user.oldAvatar || []);
      setAvatarPreview(data.user.avatar.url);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };


  const updateProfile = async (userData) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data', 
                'Authorization': `Bearer ${getToken()}`
            }
        };
        const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/me/update`, userData, config);
        setIsUpdated(data.success)
        setLoading(false)
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
    getProfile();

    if (error) {
      errMsg(error);
      setError('');
    }

    if (updateError) {
      errMsg(updateError);
     
    }

    if (isUpdated) {
      navigate('/me');
      successMsg('YOUR INFORMATION IS UPDATED SUCCESSFULLY');
    }
    }, [error, isUpdated, navigate]);


  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set('name', name);
    formData.set('email', email);

    avatar.forEach(avatars => {
        formData.append('avatar', avatars); 
    });
    updateProfile(formData)
}

  const onChange = e => {
    const files = Array.from(e.target.files)
    setAvatarPreview([]);
    setAvatar([])
    setOldAvatar([])
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
          if (reader.readyState === 2) {
            setAvatarPreview(oldArray => [...oldArray, reader.result])
            setAvatar(oldArray => [...oldArray, reader.result])
          }
      }
      reader.readAsDataURL(file)
  })
}


 

  return (
    <Fragment>
      <MetaData title={'Update Profile'} />

      <div className="row wrapper" id="upcon">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
            <h1 className="mt-2 mb-5">Update Profile</h1>
            
            <div className="form-group">
              <label htmlFor="email_field">Name</label>
              <input
                type="name"
                id="name_field"
                className="form-control"
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {oldAvatar && oldAvatar.map(img => (
                <img key={img} src={img.url} alt={img.url} className="mt-3 mr-2" width="55" height="52" />
              ))}
              {/* {avatarPreview.map(img => (
                <img src={img} key={img} alt="Preview" className="mr-2" width="100" height="100" />
              ))} */}
              {avatarPreview && avatarPreview.length > 0 && avatarPreview.map(img => (
                <img src={img} key={img} alt="Preview" className="mr-2" width="100" height="100" />
              ))}
            
            </div>

            {/* ... (other form elements) */}

            <button type="submit" className="btn update-btn btn-block mt-4 mb-3" id="upbut" disabled={loading ? true : false} >
              Update
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default UpdateProfile