import React, { Fragment, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'
import Loader from '../Layout/Loader'
import MetaData from '../Layout/MetaData'
import axios from 'axios'
import { toast, } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { getUser, getToken, successMsg, errMsg } from '../../utils/helpers'
import ListReviews from '../Photo/Review/ListReviews'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import AllMaterials from './AllMaterials';
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBListGroup,
    MDBListGroupItem,
    MDBRipple,
    MDBRow,
    MDBTooltip,
    MDBTypography,
    } from "mdb-react-ui-kit";

const PhotoDetails = ({ cartItems, addItemToCart }) => {

    const [loading, setLoading] = useState(true)
    const [photo, setPhoto] = useState({})
    const [error, setError] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [cart, setCart] = useState([])
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [review, setReviews] = useState('');
    const [errorReview, setErrorReview] = useState('');
    const [success, setSuccess] = useState('')
    
    const [success2, setSuccess2] = useState('')
    const [user, setUser] = useState(getUser())


    let { id } = useParams()
    let navigate = useNavigate()
    // const alert = useAlert();
    // const { cartItems } = state


    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [material, setMaterials] = useState([]);


    const photoDetails = async (id) => {
        // let link = `http://localhost:4000/api/v1/photo/${id}`
        try {
            let res = await axios.get(`http://localhost:4000/api/v1/photo/${id}`);
            setPhoto(res.data.photo);
            setReviews(res.data.reviews); // Assuming the reviews are returned as part of the photo data
            setLoading(false);

        } catch (err) {
            console.log(err)

            // setLoading(false)
            setError('NO PHOTO AVAILABLE')
            setLoading(false)
            // toast.error(error)
            // toast.error(err.response.data.message)
        }

    }

    const increaseQty = () => {
        const count = document.querySelector('.count');
        const qty = count.valueAsNumber + 1;
        if (qty <= selectedMaterial.stock) {
            setQuantity(qty);
        } else {
            toast.error('CANNOT ADD MORE, YOU REACH THE MAX STOCKS', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }
    
    const decreaseQty = () => {
        const count = document.querySelector('.count');
        const qty = count.valueAsNumber - 1;
        if (qty >= 1) {
            setQuantity(qty);
        }
    }
    
    const addToCart = async () => {
        try {
            // Make a request to create a new photocard

            if (!selectedMaterial || !selectedMaterial._id) {
                toast.error('PLEASE SELECT A MATERIAL');
                return;
              }
            
            const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/photocard/new/${id}/${selectedMaterial._id}`)

            
            console.log(data);
            setLoading(false);
            setSuccess2(data.success2);
            // setPhotocard(data.photocard);
            console.log(data)

            const photocardId = data.photocard._id;

        await addItemToCart(photocardId, quantity);

        } catch (error) {
            setError(error.response.data.message);
        }
        
    };

    function setUserRatings() {
        const faces = document.querySelectorAll('.face');
        faces.forEach((face, index) => {
            face.faceValue = index + 1;
            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                face.addEventListener(e, faceValues);
            })
        })
        function faceValues(e) {
            faces.forEach((face, index) => {
                if (e.type === 'click') {
                    if (index < this.faceValue) {
                        face.classList.add('red');
                        setRating(this.faceValue)
                    } else {
                        face.classList.remove('red')
                    }
                }
                if (e.type === 'mouseover') {
                    if (index < this.faceValue) {
                        face.classList.add('black');
                    } else {
                        face.classList.remove('black')
                    }
                }
                if (e.type === 'mouseout') {
                    face.classList.remove('black')
                }
            })
        }
    }

    const newReview = async (reviewData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
    
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/review/new/${id}`, reviewData, config);
            console.log(reviewData)
            setSuccess(data.success);
        } catch (error) {
            setErrorReview(error.response.data.message);
        }
    };

    const reviewHandler = () => {
        const reviewData = { rating, comment, photoId: id }; // Ensure 'id' is defined or passed appropriately
        newReview(reviewData);
        console.log(reviewData)
    };
    useEffect(() => {
        photoDetails(id)
        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            navigate('/')
        }
        if (errorReview) {
            errMsg(errorReview)
            setErrorReview('')
        }
        if (success) {
            successMsg('REVIEW SUBMITTED')
            setSuccess(false)

        }
    }, [id, error, success, errorReview]);
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    // console.log(state.cartItems)
    // console.log(cart)

    
    useEffect(() => {
        // Fetch materials from the backend API
        const chooseMaterial = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/allmaterials`);
            console.log(response.data); // Log the fetched data
            // setMaterials(response.data);
          } catch (error) {
            console.error('ERROR GETTING MATERIALS:', error);
          }
        };
    
        chooseMaterial();
      }, []);
    
      const handleMaterialChange = (material) => {
        setSelectedMaterial(material);
        console.log('Selected Material:', material.name);
        console.log('Available Stock:', material.stock);
      };

    return (
        <Fragment>
        <MetaData title={`Photo #${photo._id}`} />
        <section className="h-100 gradient-custom">
          <MDBContainer className="py-5 h-100">
            <MDBRow className="justify-content-center my-4">
              <MDBCol md="8">
                <MDBCard className="mb-0">
                  <MDBCardHeader className="py-3 custom-header">
                    <MDBTypography tag="h5" className="mb-0">
                    <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{photo.name} </strong>
                        <span>₱{photo.price}</span>
                    </h1>
                    <h6 id="photo_id">PHOTO#: {photo._id}</h6>
                    <h6>DESCRIPTION: {photo.description}</h6>
                    </MDBTypography>
                  </MDBCardHeader>
                  <MDBCardBody>
                    <MDBRow>
                      <MDBCol lg="4" md="15" className="mb-4 mb-lg-0 mt-0">
                        <MDBRipple rippleTag="div" rippleColor="light"
                          className="bg-image rounded hover-zoom hover-overlay">
                          
                        <div>
                             <Carousel pause='hover'>
                                 {photo.images && photo.images.map(image => (
                                     <Carousel.Item key={image.public_id} style={{ height: '360px', overflow: 'hidden' }}>
                                         <img className="d-block w-100 h-100 object-fit-cover" src={image.url} alt={photo.title} />
                                     </Carousel.Item>
                                 ))}
                             </Carousel>
                        </div>
                        </MDBRipple>
                      </MDBCol>

                      <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
                            <br />
                
                            <div>
                                <AllMaterials handleMaterialChange={handleMaterialChange} />

                                <div className="text-center" style={{ border: '2px solid #ddd', paddingTop: '12px', borderRadius: '100px' }}>
                                
                                    <p>AVAILABLE STOCK: {selectedMaterial.stock || 'None Selected'}</p>
                                </div>
                            </div>

                      </MDBCol>
                    
                      <MDBCol lg="3" md="12" className="mb-4 mb-lg-0 text-center">
                        <br />
                        <h5 className="mt-2 text-left"><strong>TOTAL REVIEWS:</strong></h5>
                        <div className="rating-outer inline">
                            <div className="rating-inner d-inline text-center" style={{ width: `${(photo.ratings / 5) * 100}%` }}></div>
                        </div>
                        <span id="no_of_reviews"><br/>({photo.numOfReviews} REVIEWS)</span>

                        <div className="review-button-container inline ml-3">
                            {user ? (
                                <button
                                    id="review_btn"
                                    type="button"
                                    className="btn mt-1"
                                    data-toggle="modal"
                                    data-target="#ratingModal"
                                    onClick={setUserRatings}
                                >
                                    MAKE REVIEW
                                </button>
                            ) : (
                                <div className="alert alert-danger mt-2" type="alert">
                                    SIGN IN TO SHARE YOUR REVIEW.
                                </div>
                            )}
                        </div>

                        <br />
                        <h5 className="mt-1 text-left"><strong>QUANTITY:</strong></h5>
                        <div className="d-flex mb-4 align-items-center">
                            <span className="btn minus" onClick={decreaseQty}>-</span>
                            <input type="number" className="form-control count d-inline text-center" value={quantity} readOnly />
                            <span className="btn plus" onClick={increaseQty}>+</span>
                        </div>
                        <button type="button" id="cart_btn" className="btn ml-4 text-center" disabled={selectedMaterial.stock === 0} onClick={addToCart}>
                            ADD TO CART
                        </button>
                    </MDBCol>


                       <MDBRow className="offset-lg-0 mt-3">
                        <hr/>
                            {photo.reviews && photo.reviews.length > 0 && (
                                 <ListReviews reviews={photo.reviews} />
                             )}
                            <div className="row mt-2 mb-5">
                                <div className="rating w-100">
                                    <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="ratingModalLabel">HOW SATISFIED ARE YOU?</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body d-flex flex-column align-items-center">
                                                <div className="emoji-rating text-center mb-3">
                                                <ul className="faces">
                                                    <li className="face">&#128577;</li>
                                                    <li className="face">&#128550;</li>
                                                    <li className="face">&#128528;</li>
                                                    <li className="face">&#128512;</li>
                                                    <li className="face">&#128515;</li>
                                                </ul>
                                                </div>
                                                <textarea
                                                name="review"
                                                id="review"
                                                className="form-control mt-3"
                                                placeholder="SHARE YOUR EXPERIENCE..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                ></textarea>
                                                <button className="btn my-3 review-btn px-4 text-white" data-dismiss="modal" aria-label="Close" onClick={reviewHandler}>
                                                SUBMIT
                                                </button>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </MDBRow>
                    </MDBRow>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
        /</Fragment>
        );
}
export default PhotoDetails