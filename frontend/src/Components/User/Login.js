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
import { FcGoogle} from 'react-icons/fc';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    let location = useLocation();
    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''
    // const notify = (error) => toast.error(error, {
    //     position: toast.POSITION.BOTTOM_RIGHT
    // });
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
            toast.error("invalid user or password", {
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
                                            <span class="fa fa-user"></span>
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
                                    
                                    <FaFacebook/>
                                    <FacebookLogin
                                    appId="3675250786095175"
                                    autoLoad={false}
                                    fields="name,email,picture"
                                    callback={handleFacebookLogin}
                                    textButton={false}
                                    className="custom-facebook-button" // Add a custom CSS class
                                    >
                                    <div className="facebook-button-content">
                                        <FaFacebook />
                                        <span>Facebook</span>
                                    </div>
                                    </FacebookLogin>
                                                                    
                                    </div>
              

 

    
                                        <div className="social-icon gmail" id="glink">
                                          
                                            <GoogleLogin
                                            clientId="553880286485-o027ps3rfhi9r9p50ghnjiu1j562t5fn.apps.googleusercontent.com"
                                            buttonText="Login with Google"
                                            onSuccess={responseGoogle}
                                            onFailure={responseGoogle}
                                             cookiePolicy={'none'}
                                              >
                                    <div >
                                   
                                        <span>Google</span>
                                    </div>
                                    </GoogleLogin>
                                            
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