import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../Layout/Loader'
import MetaData from '../Layout/MetaData'
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import { toast } from 'react-toastify';
import { Carousel } from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';

const Profile = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({})

  const getProfile = async () => {
    const config = {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    }
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/me`, config)
      console.log(data)
      setUser(data.user)
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
      setLoading(true)
    }

  }

  useEffect(() => {
    getProfile()

  }, [])
  return (
    <Fragment>
      {loading ? <Loader /> : (
        <Fragment>
          <MetaData title={'Your Profile'} />

          <div className="gradient-custom-2" style={{ backgroundColor: 'bls' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                {user.avatar.length > 0 && (
                  <MDBCardImage src={user.avatar[0].url}
                    alt="Generic placeholder image" className="mt-4 mb-2 img-thumbnail" 
                    fluid 
                    style={{ width: '150px', height: '150px', objectFit: 'cover', zIndex: '1'}} />  
                 )}
                </div>
                <div className="ms-3" style={{ marginTop: '130px' }}>
                  <MDBTypography tag="h5">{user.name}</MDBTypography>
                  <MDBCardText>{user.email}</MDBCardText>
                </div>
              </div>
              <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <MDBBtn id="profbutton" outline color="dark" style={{height: '36px', overflow: 'visible'}}>
                      
                      <Link to="/me/update" id="proflink">
                          EDIT PROFILE
                        </Link>
                    </MDBBtn>
                  </div>
                  <div>
                    {user.role ? (
                    <MDBBtn id="profbutton" outline color="dark" style={{height: '36px', overflow: 'visible'}}>
                      <Link to="/orders/me" id="proflink">
                        MY ORDERS
                      </Link>
                    </MDBBtn>
                  ) : ('')}
                  </div>
                  <div>
                    {user.role ? (
                    <MDBBtn id="profbutton" outline color="dark" style={{height: '36px', overflow: 'visible'}}>
                      <Link to="/password/update" id="proflink">
                        CHANGE PASSWORD
                      </Link>
                    </MDBBtn>
                  ):('')}
                  </div>
                </div>
              </div>
              <MDBCardBody className="text-black p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-0">AVATARS</MDBCardText>
                </div>
                <MDBContainer>
                  {user.avatar && user.avatar.length > 0 && (
                    // Loop through avatars and create rows with three columns each
                    user.avatar.reduce((rows, avatar, index) => {
                      if (index % 3 === 0) {
                        rows.push([]);
                      }
                      rows[rows.length - 1].push(avatar);
                      return rows;
                    }, []).map((rowAvatars, rowIndex) => (
                      <MDBRow key={rowIndex}>
                        {rowAvatars.map((avatar) => (
                          <MDBCol key={avatar.public_id} className="mb-2" md="4">
                            <MDBCardImage src={avatar.url} alt={`Image ${avatar.public_id}`} className="w-100 rounded-3" />
                          </MDBCol>
                        ))}
                      </MDBRow>
                    ))
                  )}
                </MDBContainer>

              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default Profile