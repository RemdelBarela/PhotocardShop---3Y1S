import React, { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Loader from '../Layout/Loader' 
import MetaData from '../Layout/MetaData'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {authenticate} from '../../utils/helpers'
import { getUser } from '../../utils/helpers';
import { FaFacebook} from 'react-icons/fa';
import { GoogleLogin } from 'react-google-login'
import { LoginSocialFacebook } from 'reactjs-social-login';

import { FcGoogle} from 'react-icons/fc';
import Modal from 'react-modal' // Replace with your modal library

const clientID = "526985758798-b5jsd5g1grsqi5k3g49vka6r1dmu29b2.apps.googleusercontent.com";

    const Login = () => {
        
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [loading, setLoading] = useState(false)
        const navigate = useNavigate()
        let location = useLocation();
        const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''
        const [showModal, setShowModal] = useState(false);
    const [profile, setProfile] = useState(null);

    const handleLoginClick = () => {
        // Show the modal before proceeding with Facebook login
        setShowModal(true);
    };

    const handleModalConfirm = () => {
        // User confirmed, proceed with Facebook login
        setShowModal(false);
        //setProfile(response.data);
        if (profile) {
            console.log(profile.accessToken);
            login(profile.email, profile.id);
        }
    };

    const handleModalReject = () => {
        setShowModal(false);
    };

    const handleFacebookLogin = (response) => {
        // Handle the Facebook login response
       
        if (response.email) {
            login(response.email, ''); // No password is required for Facebook login
          } else {
            // Handle the case where the email is not available in the Facebook response
            console.error('Email not available in the Facebook response');
          }
      };
    
    const responseGoogle = (response) => {
        // Handle the response from Google, e.g., send it to your server for authentication
        console.log(response);
      };
      
    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/login`, { email, password }, config)
            console.log(data)
            authenticate(data, () => navigate("/"))

        } catch (error) {
            toast.error("INVALID USER OR PASSWORD", {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }
    }
    const submitHandler = (e) => {
        e.preventDefault();
        login(email, password)
    }

    useEffect(() => {
        if (getUser() && redirect === 'shipping' ) {
             navigate(`/${redirect}`)
        }
    }, [])


    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Login'} />
                    <div className="l-row wrapper">
                        <div className="l-col-10 col-lg-5">
                            <div class="bg-img">
                                <div class="l-content">
                                    <header>LOGIN FORM</header>
                                    <form onSubmit={submitHandler}>
                                        <div class="field">
                                            <span class="fa fa-envelope"></span>
                                                <input placeholder="EMAIL OR PHONE"
                                                    type="email"
                                                    id="email_field"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}/>
                                        </div>
                                        <div class="field space">
                                            <span class="fa fa-lock"></span>
                                            <input required placeholder="PASSWORD"
                                                    type="password"
                                                    id="password_field"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}/>
                                        </div>
                                        <div class="pass">
                                            <a href="/password/forgot">FORGOT PASSWORD?</a>
                                        </div>
                                        <div className="field">
                                            <button id="login_button" type="submit">LOGIN</button>
                                        </div>
                                    </form>
                                    <div class="login">OR LOGIN WITH</div>
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
                                                        overlayClassName="custom-overlay" >
                                                        
                                                        <div className="modal-content">
                                                            <p>Are you sure you want to log in with Facebook?</p>
                                                            <button className="yes" onClick={handleModalConfirm}>Yes</button>
                                                            <button className="no" onClick={handleModalReject}>No</button>
                                                        </div>
                                                    </Modal>
                                                </div>
                                            </div>
                                            <div className="social-icon gmail" id="glink" >
                                                <div>       
                                                    < GoogleLogin
                                                        clientId={clientID}
                                                        onSuccess={(response) => {
                                                            console.log(response);
                                                            setProfile(response);

                                                            if (profile) {
                                                                console.log(profile.accessToken);
                                                                try {
                                                        
                                                                    login(profile.profileObj.email, profile.profileObj.googleId);
                                                            
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
                                                                
                                                                <button
                                                                onClick={renderProps.onClick}
                                                                disabled={renderProps.disabled}
                                                                className='social-icon gmail' id="glink2"
                                                                
                                                                >
                                                                <FcGoogle id="glink"/> </button>
                                                            )}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="signup">DON'T HAVE ACCOUNT?
                                                    <a href="/register"> SIGNUP NOW</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Login