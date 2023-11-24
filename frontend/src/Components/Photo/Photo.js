import React from 'react'
import {Link} from 'react-router-dom'
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
    <MDBContainer fluid>
      <MDBRow className="justify-content-center mb-0">
        <MDBCol md="12" xl="10">
          <MDBCard className="shadow-0 border rounded-3 mt-5 mb-3">
            <MDBCardBody>
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
                      style={{ width: '150px', height: '150px', objectFit: 'cover'}}
                    />
                    <a href="#!">
                      <div
                        className="mask"
                        style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                      ></div>
                    </a>
                  </MDBRipple>
                </MDBCol>
                <MDBCol md="6">
                  <h5>{photo.name}</h5>
                  <div className="ratings mt-auto">
                        <div className="rating-outer">
                            <div className="rating-inner" style={{ width: `${(photo.ratings / 5) * 100}%` }}></div>
                        </div>
                        <span id="no_of_reviews">({photo.numOfReviews} reviews)</span>
                    </div>
                  <p className="text-truncate mb-4 mb-md-0">
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
                    <MDBBtn color="primary" size="sm" id="Bviewdeets">
                    <Link to={`/photo/${photo._id}`} id="viewdeets">VIEW DETAILS</Link>
                    </MDBBtn>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    )
}
export default Photo