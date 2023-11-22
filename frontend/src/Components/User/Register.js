import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import axios from 'axios' 
import { FaFacebook} from 'react-icons/fa';
import { FcGoogle} from 'react-icons/fc';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import { LoginSocialFacebook } from 'reactjs-social-login';

// import { FacebookLoginButton } from 'reactjs-facebook-login-buttons';

const Register = () => {

//     const [user, setUser] = useState({
//         name: '',
//         email: '',
//         password: '',
//     })

//     const { name, email, password } = user;
    const responseFacebook = (e) => {
        // Handle the Facebook login response
        // You can send the obtained user information to your server for registration
         
        
        // const formData = new FormData();
        // formData.set('name', e.name);
        // formData.set('email', e.email);
        // formData.set('password', e.password);
        // avatar.forEach(avatars => {
        //     formData.append('avatar', avatars);
        // });
        
        // register(formData)
        
    };

    const responseGoogle = (response) => {
        // Handle the Gmail login response
        // Send the obtained user information to your server for registration
        console.log(response);
      };


      const registerWithFacebook = async (response) => {
        try {
          setLoading(true);
    
          // Send Facebook response to server for registration
          const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/register/facebook`, {
            accessToken: response.accessToken,
            userID: response.userID,
          });
    
          // Handle success, update state, redirect, etc.
          setIsAuthenticated(true);
          setLoading(false);
          navigate('/');
        } catch (error) {
          // Handle error
          setLoading(false);
          setError(error.response.data.error);
        }
      };
    
      const registerWithGoogle = async (response) => {
        try {
          setLoading(true);
    
          // Send Google response to server for registration
          const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/register/google`, {
            tokenId: response.tokenId,
          });
    
          // Handle success, update state, redirect, etc.
          setIsAuthenticated(true);
          setLoading(false);
          navigate('/');
        } catch (error) {
          // Handle error
          setLoading(false);
          setError(error.response.data.error);
        }
      };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState([]);
    const [avatarPreview, setAvatarPreview] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [profile , setProfile] = useState(null);

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
                                    <LoginSocialFacebook
                                    appId='3675250786095175'
                                    onResolve={registerWithFacebook}
                                    
                                    onReject={(response)=>{
                                        console.log(response);
                                    }}>
                                         <FaFacebook />
                                        {/* <FacebookLoginButton/> */}
                                    </LoginSocialFacebook>
                                    {/* <FaFacebook/>
                                    <FacebookLogin
                                    appId="3675250786095175"
                                    autoLoad={false}
                                    fields="name,email,picture"
                                    callback={responseFacebook}
                                    textButton={false}
                                    className="custom-facebook-button" // Add a custom CSS class
                                    >
                                    <div className="facebook-button-content">
                                        <FaFacebook />
                                        <span>Facebook</span>
                                    </div>
                                    </FacebookLogin> */}
                                                                    
                                    </div>
              
                                    </div>
                                    <div className="social-icon gmail" id="glink">
                                          
                                          <GoogleLogin
                                          clientId="553880286485-o027ps3rfhi9r9p50ghnjiu1j562t5fn.apps.googleusercontent.com"
                                          buttonText="Login with Google"
                                          onSuccess={registerWithGoogle}
                                          onFailure={registerWithGoogle}
                                          cookiePolicy={'none'} // Use 'single_host_origin' for localhost

                                            >
                                  <div >
                                 
                                      <span>Google</span>
                                  </div>
                                  </GoogleLogin>
                                          
                                      </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
    )
}
export default Register