import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import axios from 'axios'  
import { FaFacebook} from 'react-icons/fa';
import { FcGoogle} from 'react-icons/fc';
import { GoogleLogin } from 'react-google-login';
import { LoginSocialFacebook } from 'reactjs-social-login';
import Modal from 'react-modal' 
import { gapi } from 'gapi-script';

import { toast } from 'react-toastify';
const clientID = "526985758798-b5jsd5g1grsqi5k3g49vka6r1dmu29b2.apps.googleusercontent.com";
const Register = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState([]);
    const [avatarPreview, setAvatarPreview] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false);
    const [profile, setProfile] = useState(null);

    const handleLoginClick = () => {
        setShowModal(true);
    };

    const handleModalConfirm = () => {
        setIsAuthenticated(false);
        setShowModal(false);
      
        if (profile) {
            console.log(profile.accessToken);
            try {
            const formData = new FormData();
            formData.set('name', profile.name);
            formData.set('email', profile.email);
            formData.set('password', profile.id);

            formData.append('avatar', profile.picture.data.url);

            register(formData);
            } catch (error) {
            console.error('Registration error:', error);
            }
        }
    };

    const handleModalReject = () => {
        setShowModal(false);
        // Reset isAuthenticated state to allow for multiple logins
        setIsAuthenticated(false);
      };

        let navigate = useNavigate()
        useEffect(() => {
            if (isAuthenticated) {
                navigate('/')
            }
            if (error) {
                console.log(error)
            setError()
            }

        }, [error, isAuthenticated,])

        const submitHandler = (e) => {
            e.preventDefault();

            const formData = new FormData();
              avatar.forEach(avatars => {
                formData.append('avatar', avatars);
            });
            formData.set('name', name);
            formData.set('email', email);
            formData.set('password', password);
          
            
            register(formData)
        }

    const onChange = e => {
            const files = Array.from(e.target.files);
            setAvatarPreview([]);
            setAvatar([]);
            files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.readyState === 2) {
                            setAvatarPreview(oldArray => [...oldArray, reader.result]);
                            setAvatar(oldArray => [...oldArray, reader.result]);
                        }
                    }
                    reader.readAsDataURL(file)
            
            });
    };


    // useEffect(() => {
    //     const start = async () => {
    //         try {
    //             await gapi.client.init({
    //                 clientId: clientID,
    //                 scope: "", // Add the required scope if needed
    //             });
    //         } catch (error) {
    //             console.error('Error initializing Google API client:', error);
    //         }
    //     };
    
    //     gapi.load('client:auth2', start);
    // }, []);
    

    const register = async (userData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/register`, userData, config)
            console.log(data.user)
            setIsAuthenticated(true)
            setLoading(false)
            // setUser(data.user)
            navigate('/')

        } catch (error) {
            setIsAuthenticated(false)
            setLoading(false)
            setError(error)
            console.log('Server response:', error.response);
    
            if (error.response && error.response.status === 400 && error.response.data.errors) {
                // If the server returns validation errors, display them to the user
                const validationErrors = error.response.data.errors;
                validationErrors.forEach(errorMessage => {
                    toast.error(errorMessage, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                });
            } else {
                // For other errors, show a generic message
                toast.error("INVALID USER OR PASSWORD", {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }
        }
    }

    return (
        <Fragment>
                <MetaData title={'REGISTER'} />
                <div className="r-row wrapper">
                    <div className="r-col-10 col-lg-5">
                        <div className="bg-img">
                            <div className="r-content">
                                <header>REGISTER FORM</header>
                                <form onSubmit={submitHandler} encType='multipart/form-data'>
                                    <div className="field">
                                        <span className="fa fa-user"></span>
                                            <input placeholder="NAME"
                                                type="text"
                                                id="name_field"
                                                // name='name'
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}/>
                                    </div>
                                    <div className="field space">
                                        <span className="fa fa-envelope"></span>
                                            <input placeholder="EMAIL"
                                                type="email"
                                                id="email_field"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}/>
                                    </div>
                                    <div className="field space">
                                        <span className="fa fa-lock"></span>
                                        <input required placeholder="PASSWORD"
                                                type="password"
                                                id="password_field"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}/>
                                    </div>
                                    <div className="r-field space">
                                        <div className='d-flex align-items-center'>
                                            <div>
                                                <figure className='avatar mr-3 item-rtl'>
                                                    {avatarPreview.map(img => (
                                                        <img src={img} key={img} alt="Avatar Preview" 
                                                        className="mr-2" width="100" height="100"
                                                        />
                                                    ))}
                                                </figure>
                                            </div>
                                            <div className='custom-file text-center'>
                                                <input
                                                    type='file'
                                                    name='avatar'
                                                    className='custom-file-input'
                                                 id='customFile'
                                                    accept="images/*"
                                                    onChange={onChange}
                                                    multiple
                                                />
                                                <label className='custom-file-label' htmlFor='customFile'>
                                                CHOOSE AVATAR
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field space">
                                        <button id="register_button" type="submit">REGISTER</button>
                                    </div>
                                </form>
                                <div className="login">OR REGISTER WITH</div>
                                    <div className="links">
                                        <div className="social-icon facebook" id="flink">
                                            <div> 
                                                <LoginSocialFacebook
                                                    appId='3675250786095175'
                                                    onResolve={(response) => {
                                                    setProfile(response.data);
                                                    handleLoginClick();
                                                    }}
                                                    onReject={(response) => {
                                                    console.log(response);
                                                    }}
                                                >
                                                    <FaFacebook />
                                                </LoginSocialFacebook>

                                                <Modal
                                                    isOpen={showModal}
                                                    onRequestClose={handleModalReject}
                                                    contentLabel="Login Confirmation"
                                                    className="custom-modal" // Add a custom class for styling
                                                    overlayClassName="custom-overlay" // Add a custom class for overlay styling
                                                    >
                                                    
                                                    <div className="modal-content">
                                                        <p>Are you sure you want to log in with Facebook?</p>
                                                        <button className="yes" onClick={handleModalConfirm}>Yes</button>
                                                        <button className="no" onClick={handleModalReject}>No</button>
                                                    </div>
                                                </Modal>
                                            </div>                               
                                        </div>
              
                                        <div className="social-icon gmail" id="glink">
                                            <div>
                                                <GoogleLogin
                                                    clientId={clientID}
                                                    buttonText="Login with Google"
                                                    onSuccess={(response) => {
                                                        console.log(response);
                                                        setProfile(response);

                                                        if (profile) {
                                                            console.log(profile.accessToken);
                                                            try {
                                                            const formData = new FormData();
                                                            formData.set('name', profile.profileObj.name);
                                                            formData.set('email', profile.profileObj.email);
                                                            formData.set('password', profile.profileObj.googleId);
                                                
                                                            formData.append('avatar', profile.profileObj.imageUrl);
                                                            
                                                            register(formData);
                                                            } catch (error) {
                                                            console.error('Registration error:', error);
                                                            }
                                                        }
                                                    }}
                                                    onFailure={(response) => {
                                                        console.log(response);
                                                    }}
                                                    cookiePolicy={'single_host_origin'}
                                                    isSignedIn={true}
                                                    render={(renderProps) => (
                                                        <FcGoogle
                                                          onClick={renderProps.onClick}
                                                          disabled={renderProps.disabled}
                                                          size={18}
                                                        />
                                                      )}
                                                    />
                                               
                                            </div>
                                        </div>
                                     </div>
                                 </div>
                            </div>
                        </div>
                </div>
            </Fragment>
    )
}
export default Register