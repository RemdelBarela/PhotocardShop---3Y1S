// import React, { Fragment, useState, useEffect } from 'react'

// import MetaData from './Layout/MetaData'
// import axios from 'axios'
// import Pagination from 'react-js-pagination'
// import Photo from './Photo/Photo'
// import Loader from './Layout/Loader'
// // import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';
// import { useParams } from "react-router-dom"

// const Home = () => {
//     let { keyword } = useParams()
//     const [loading, setLoading] = useState(true)
//     const [photos, setPhotos] = useState([])
//     const [error, setError] = useState()
//     const [photosCount, setPhotosCount] = useState(0)
//     const [currentPage, setCurrentPage] = useState(1)
//     const [resPerPage, setResPerPage] = useState(0)
//     const [filteredPhotosCount, setFilteredPhotosCount] = useState(0)
//     const [price, setPrice] = useState([1, 1000]);


//     // const createSliderWithTooltip = Slider.createSliderWithTooltip;
//     // const Range = createSliderWithTooltip(Slider.Range);

//     function setCurrentPageNo(pageNumber) {
//         setCurrentPage(pageNumber)
//     }


//     const getPhotos = async (page = 1, keyword = '', price) => {
//         let link = ''

//         link = `${process.env.REACT_APP_API}/api/v1/photos/?page=${page}`

//         console.log(link)
//         let res = await axios.get(link)
//         console.log(res)
//         setPhotos(res.data.photos)
//         setResPerPage(res.data.resPerPage)
//         setPhotosCount(res.data.photosCount)
//         setFilteredPhotosCount(res.data.filteredPhotosCount)
//         setLoading(false)
//     }
//     useEffect(() => {
//         getPhotos(currentPage, keyword, price)
//     }, [currentPage, keyword, price]);

//     let count = photosCount
//     if (keyword) {
//         count = filteredPhotosCount
//     }
//     return (
//         <>
//             {loading ? <Loader /> : (<Fragment>
//                 <MetaData title={'Buy Best Photos Online'} />
//                 <div className="container container-fluid">
//                     <h1 id="photos_heading">Latest Photos</h1>
//                     <section id="photos" className="container mt-5">
//                         <div className="row">
//                             {keyword ? (
//                                 <Fragment>
                                    
//                                     <div className="col-6 col-md-9">
//                                         <div className="row">
//                                             {photos.map(photo => (
//                                                 <Photo key={photo._id} photo={photo} col={4} />
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </Fragment>
//                             ) : (
//                                 photos.map(photo => (
//                                     <Photo key={photo._id} photo={photo} col={3} />
//                                 ))
//                             )}
//                         </div>
//                     </section>
//                     {resPerPage <= count && (
//                         <div className="d-flex justify-content-center mt-5">
//                             <Pagination
//                                 activePage={currentPage}
//                                 itemsCountPerPage={resPerPage}
//                                 totalItemsCount={photosCount}
//                                 onChange={setCurrentPageNo}
//                                 nextPageText={'Next'}
//                                 prevPageText={'Prev'}
//                                 firstPageText={'First'}
//                                 lastPageText={'Last'}
//                                 itemClass="page-item"
//                                 linkClass="page-link"
//                             />
//                         </div>)}
//                 </div>
//             </Fragment>
//             )}
           
//         </>
//     )
// }

// export default Home

import React, { Fragment, useState, useEffect } from 'react';
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
import axios from 'axios';
import Pagination from 'react-js-pagination';
import Photo from './Photo/Photo';
import Loader from './Layout/Loader';
import { useParams } from 'react-router-dom';

const Home = () => {
  let { keyword } = useParams();
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState();
  const [photosCount, setPhotosCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resPerPage, setResPerPage] = useState(0);
  const [filteredPhotosCount, setFilteredPhotosCount] = useState(0);
  const [price, setPrice] = useState([1, 1000]);

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  const getPhotos = async (page = 1, keyword = '', price) => {
    let link = '';

    link = `${process.env.REACT_APP_API}/api/v1/photos/?page=${page}`;

    console.log(link);
    let res = await axios.get(link);
    console.log(res);
    setPhotos(res.data.photos);
    setResPerPage(res.data.resPerPage);
    setPhotosCount(res.data.photosCount);
    setFilteredPhotosCount(res.data.filteredPhotosCount);
    setLoading(false);
  };

  useEffect(() => {
    getPhotos(currentPage, keyword, price);
  }, [currentPage, keyword, price]);

  let count = photosCount;
  if (keyword) {
    count = filteredPhotosCount;
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MDBContainer fluid>
            <MDBRow className="justify-content-center mb-0">
              {photos.map((photo) => (
                <MDBCol md="12" xl="10" key={photo._id}>
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
                              src={photo.imageUrl}
                              fluid
                              className="w-100"
                            />
                            <a href="#!">
                              <div
                                className="mask"
                                style={{
                                  backgroundColor: 'rgba(251, 251, 251, 0.15)',
                                }}
                              ></div>
                            </a>
                          </MDBRipple>
                        </MDBCol>
                        <MDBCol md="6">
                          <h5>{photo.title}</h5>
                          {/* Add your other details here */}
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
                            <h4 className="mb-1 me-1">${photo.price}</h4>
                            <span className="text-danger">
                              <s>${photo.discountedPrice}</s>
                            </span>
                          </div>
                          <h6 className="text-success">
                            {photo.freeShipping ? 'Free shipping' : ''}
                          </h6>
                          <div className="d-flex flex-column mt-4">
                            <MDBBtn color="primary" size="sm">
                              Details
                            </MDBBtn>
                            <MDBBtn
                              outline
                              color="primary"
                              size="sm"
                              className="mt-2"
                            >
                              Add to wish list
                            </MDBBtn>
                          </div>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              ))}
            </MDBRow>
            {resPerPage <= count && (
              <div
                className="d-flex justify-content-center mt-5"
                style={{ marginBottom: '100px' }}
              >
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resPerPage}
                  totalItemsCount={photosCount}
                  onChange={setCurrentPageNo}
                  nextPageText={'Next'}
                  prevPageText={'Prev'}
                  firstPageText={'First'}
                  lastPageText={'Last'}
                  itemClass="page-item"
                  linkClass="page-link"
                />
              </div>
            )}
          </MDBContainer>
        </Fragment>
      )}
    </>
  );
};

export default Home;
