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
                                            <FaFacebook />
                                            <span>Facebook</span>
                                        </div>
                                        <div className="social-icon gmail" id="glink">
                                            <FcGoogle />
                                            <span>Google</span>
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