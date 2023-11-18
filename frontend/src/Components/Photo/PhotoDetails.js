// import React, { Fragment, useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { Carousel } from 'react-bootstrap'
// import Loader from '../Layout/Loader'
// import MetaData from '../Layout/MetaData'
// import axios from 'axios'
// import { toast, } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";
// import { getUser, getToken, successMsg, errMsg } from '../../utils/helpers'
// import ListReviews from '..Photo/Review/ListReviews'


// const PhotoDetails = ({ cartItems, addItemToCart }) => {

//     const [loading, setLoading] = useState(true)
//     const [photo, setPhoto] = useState({})
//     const [error, setError] = useState('')
//     const [quantity, setQuantity] = useState(1)
//     const [cart, setCart] = useState([])
//     const [rating, setRating] = useState(0)
//     const [comment, setComment] = useState('')
//     const [errorReview, setErrorReview] = useState('');
//     const [success, setSuccess] = useState('')
//     const [user, setUser] = useState(getUser())



//     let { id } = useParams()
//     let navigate = useNavigate()
//     // const alert = useAlert();
//     // const { cartItems } = state

//     const PhotoDetails = async (id) => {
//         let link = `http://localhost:4000/api/v1/photo/${id}`
//         try {
//             let res = await axios.get(link)
//             setPhoto(res.data.photo)
//             setLoading(false)

//         } catch (err) {
//             console.log(err)

//             // setLoading(false)
//             setError('NO IMAGE AVAILABLE')
//             setLoading(false)
//             // toast.error(error)
//             // toast.error(err.response.data.message)
//         }

//     }
//     const increaseQty = () => {
//         const count = document.querySelector('.count')
//         if (count.valueAsNumber >= photo.stock) return;
//         const qty = count.valueAsNumber + 1;
//         setQuantity(qty)
//     }

//     const decreaseQty = () => {
//         const count = document.querySelector('.count')
//         if (count.valueAsNumber <= 1) return;
//         const qty = count.valueAsNumber - 1;
//         setQuantity(qty)
//     }


//     const addToCart = async () => {
//         await addItemToCart(id, quantity);
//     }
//     function setUserRatings() {
//         const stars = document.querySelectorAll('.star');
//         stars.forEach((star, index) => {
//             star.starValue = index + 1;
//             ['click', 'mouseover', 'mouseout'].forEach(function (e) {
//                 star.addEventListener(e, showRatings);
//             })
//         })
//         function showRatings(e) {
//             stars.forEach((star, index) => {
//                 if (e.type === 'click') {
//                     if (index < this.starValue) {
//                         star.classList.add('orange');
//                         setRating(this.starValue)
//                     } else {
//                         star.classList.remove('orange')
//                     }
//                 }
//                 if (e.type === 'mouseover') {
//                     if (index < this.starValue) {
//                         star.classList.add('yellow');
//                     } else {
//                         star.classList.remove('yellow')
//                     }
//                 }
//                 if (e.type === 'mouseout') {
//                     star.classList.remove('yellow')
//                 }
//             })
//         }
//     }

//     const newReview = async (reviewData) => {
//         try {
//             const config = {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${getToken()}`
//                 }
//             }

//             const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/review`, reviewData, config)
//             setSuccess(data.success)

//         } catch (error) {
//             setErrorReview(error.response.data.message)
//         }
//     }

//     const reviewHandler = () => {
//         const formData = new FormData();
//         formData.set('rating', rating);
//         formData.set('comment', comment);
//         formData.set('photoId', id);
//         newReview(formData)

//     }
//     useEffect(() => {
//         PhotoDetails(id)
//         if (error) {
//             toast.error(error, {
//                 position: toast.POSITION.TOP_LEFT
//             });
//             navigate('/')
//         }
//         if (errorReview) {
//             errMsg(errorReview)
//             setErrorReview('')
//         }
//         if (success) {
//             successMsg('REVIEW SUBMITTED')
//             setSuccess(false)

//         }
//     }, [id, error, success, errorReview]);
//     localStorage.setItem('cartItems', JSON.stringify(cartItems))
//     // console.log(state.cartItems)
//     // console.log(cart)
//     return (
//         <Fragment>

//             {loading ? <Loader /> : (
//                 <Fragment>
//                     <MetaData title={photo.name} />
//                     <div className="row d-flex justify-content-around">
//                         <div className="col-12 col-lg-5 img-fluid" id="photo_image">
//                             <Carousel pause='hover'>
//                                 {photo.images && photo.images.map(image => (
//                                     <Carousel.Item key={image.public_id}>
//                                         <img className="d-block w-100" src={image.url} alt={photo.title} />
//                                     </Carousel.Item>
//                                 ))}
//                             </Carousel>
//                         </div>

//                         <div className="col-12 col-lg-5 mt-5">
//                             <h3>{photo.name}</h3>
//                             <p id="photo_id">photo # {photo._id}</p>

//                             <hr />

//                             <div className="rating-outer">
//                                 <div className="rating-inner" style={{ width: `${(photo.ratings / 5) * 100}%` }}></div>
//                             </div>
//                             <span id="no_of_reviews">({photo.numOfReviews} Reviews)</span>

//                             <hr />

//                             <p id="photo_price">${photo.price}</p>
//                             <div className="stockCounter d-inline">
//                                 <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

//                                 <input type="number" className="form-control count d-inline" value={quantity} readOnly />

//                                 <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
//                             </div>
//                             <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" disabled={photo.stock === 0} onClick={addToCart}>Add to Cart</button>

//                             <hr />

//                             <p>Status: <span id="stock_status" className={photo.stock > 0 ? 'greenColor' : 'redColor'} >{photo.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>

//                             <hr />

//                             <h4 className="mt-2">Description:</h4>
//                             <p>{photo.description}</p>
//                             <hr />
//                             {/* <p id="photo_seller mb-3">Sold by: <strong>{photo.seller}</strong></p> */}

//                             {user ? <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal" onClick={setUserRatings} >
//                             KINDLY SUBMIT YOUR REVIEW
//                             </button> : <div className="alert alert-danger mt-5" type='alert'>KINDLY SING IN TO SHARE YOUR REVIEW.</div>}




//                             <div className="row mt-2 mb-5">
//                                 <div className="rating w-50">

//                                     <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
//                                         <div className="modal-dialog" role="document">
//                                             <div className="modal-content">
//                                                 <div className="modal-header">
//                                                     <h5 className="modal-title" id="ratingModalLabel">SUBMIT REVIEW</h5>
//                                                     <button type="button" className="close" data-dismiss="modal" aria-label="Close">
//                                                         <span aria-hidden="true">&times;</span>
//                                                     </button>
//                                                 </div>
//                                                 <div className="modal-body">

//                                                     <ul className="stars" >
//                                                         <li className="star"><i className="fa fa-star"></i></li>
//                                                         <li className="star"><i className="fa fa-star"></i></li>
//                                                         <li className="star"><i className="fa fa-star"></i></li>
//                                                         <li className="star"><i className="fa fa-star"></i></li>
//                                                         <li className="star"><i className="fa fa-star"></i></li>
//                                                     </ul>

//                                                     <textarea
//                                                         name="review"
//                                                         id="review" className="form-control mt-3"
//                                                         value={comment}
//                                                         onChange={(e) => setComment(e.target.value)}
//                                                     >
//                                                     </textarea>

//                                                     <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close" onClick={reviewHandler}>Submit</button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                 </div>
//                             </div>
//                             {photo.reviews && photo.reviews.length > 0 && (

//                                 <ListReviews reviews={photo.reviews} />

//                             )}
//                         </div>
//                     </div>
//                 </Fragment>
//             )}
//         </Fragment>
//     )

// }
// export default PhotoDetails