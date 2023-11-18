import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import axios from 'axios' 
import { FaFacebook} from 'react-icons/fa';
import { FcGoogle} from 'react-icons/fc';

const Register = () => {

//     const [user, setUser] = useState({
//         name: '',
//         email: '',
//         password: '',
//     })

//     const { name, email, password } = user;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState([]);
    const [avatarPreview, setAvatarPreview] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
   

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
        formData.set('name', name);
        formData.set('email', email);
        formData.set('password', password);
        avatar.forEach(avatars => {
            formData.append('avatar', avatars);
        });
        
        register(formData)
    }

    const onChange = e => {
        const files = Array.from(e.target.files);
        setAvatarPreview([]);
        setAvatar([]);
        files.forEach(file => {
            // if (e.target.name === 'avatar') {
            //     const reader = new FileReader();
            //     reader.onload = () => {
            //         if (reader.readyState === 2) {
            //             setAvatarPreview(oldArray => [...oldArray, reader.result]);
            //             setAvatar(oldArray => [...oldArray, reader.result]);
            //         }
            //     }
            //     reader.readAsDataURL(file)
            // } else {
            //     setUser({ ...user, [e.target.name]: e.target.value })
            // }
            
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.readyState === 2) {
                        setAvatarPreview(oldArray => [...oldArray, reader.result]);
                        setAvatar(oldArray => [...oldArray, reader.result]);
                    }
                }
                reader.readAsDataURL(file)
        
        })
    }

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
            // setUser(null)
            setError(error)
            console.log(error)
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
                                                name='name'
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}/>
                                    </div>
                                    <div className="field space">
                                        <span className="fa fa-user"></span>
                                            <input placeholder="EMAIL"
                                                type="email"
                                                id="email_field"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}/>
                                    </div>
                                    <div className="field space">
                                        <span className="fa fa-lock"></span>
                                        <input required placeholder="Password"
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
                                            <div className='custom-file'>
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
                                <div className="login">Or Register with</div>
                                <div className="links">
                                    <div className="social-icon facebook" id="flink">
                                        <FaFacebook />
                                        <span>Facebook</span>
                                    </div>
                                    <div className="social-icon gmail" id="glink">
                                        <FcGoogle/>
                                        <span>Google</span>
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