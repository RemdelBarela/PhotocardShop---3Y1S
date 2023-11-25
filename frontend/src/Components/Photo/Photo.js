import React from 'react';
import { Link } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,    
  MDBIcon,
  MDBRipple,
  MDBBtn,
} from 'mdb-react-ui-kit';

const Photo = ({ photo }) => {
  return (
    <MDBContainer fluid >
      <MDBRow className="justify-content-center mb-0"  >
        <MDBCol md="12" xl="10"  style={{marginBottom: '10px'}}>
          <MDBCard className="shadow- border rounded-1 mt-4 mb-2" >
            <MDBCardBody >
              <MDBRow>
                <MDBCol md="12" lg="3" className="mb-4 mb-lg-0">
                  <MDBRipple
                    rippleColor="light"
                    rippleTag="div"
                    className="bg-image rounded hover-zoom hover-overlay"
                  >
                    <MDBCardImage 
                      src={photo.images[0].url}
                      fluid
                      className="w-100"
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        marginLeft: '10px', 
                        marginBottom: '-75px',
                        
                      }}
                    />

                    <div
                      className="mask"
                      style={{
                        backgroundColor: 'rgba(251, 251, 251, 0.15)',
                      }}
                    ></div>
                  </MDBRipple>
                </MDBCol>
                <MDBCol md="6" >
                <h5 style={{ marginLeft: '20px' }}>{photo.name}</h5>

                  <div className="ratings mt-auto"style={{marginLeft: '20px'}}>
                    <div className="rating-outer">
                      <div
                        className="rating-inner"
                        style={{ width: `${(photo.ratings / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span id="no_of_reviews">({photo.numOfReviews} reviews)</span>
                  </div>
                  <p className="text-truncate mb-4 mb-md-0"style={{marginLeft: '20px'}}>
                    {photo.description}
                  </p>
                </MDBCol>
                <MDBCol
                  md="6"
                  lg="3"
                  className="border-sm-start-none border-start"
                >
                  <div className="d-flex flex-row align-items-center mb-1">
                    <h4 className="mb-1 me-1">₱ {photo.price}</h4>
                  </div>
                  <h6 className="text-success">Free shipping</h6>
                  <div className="d-flex flex-column mt-4">
                    <button
                      style={{
                        padding: '5px 10px',
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = 'red')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = 'black')
                      }
                    >
                      <Link
                        to={`/photo/${photo._id}`}
                        id="viewdeets"
                        style={{ color: 'inherit' }}
                      >
                        VIEW DETAILS
                      </Link>
                    </button>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Photo;