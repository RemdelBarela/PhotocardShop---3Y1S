// import React, { Fragment, useState, useEffect } from 'react'

// import MetaData from './Layout/MetaData'
// import axios from 'axios'
// import Pagination from 'react-js-pagination'
// // import Product from './Product/Product'
// import Loader from './Layout/Loader'
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';
// import { useParams } from "react-router-dom"

// const Home = () => {
//     let { keyword } = useParams()
//     const [loading, setLoading] = useState(true)
//     const [photos, setphotos] = useState([])
//     const [error, setError] = useState()
//     const [photosCount, setphotosCount] = useState(0)
//     const [currentPage, setCurrentPage] = useState(1)
//     const [resPerPage, setResPerPage] = useState(0)
//     const [filteredPhotosCount, setfilteredPhotosCount] = useState(0)
//     const [price, setPrice] = useState([1, 1000]);

//     // const createSliderWithTooltip = Slider.createSliderWithTooltip;
//     // const Range = createSliderWithTooltip(Slider.Range);

//     function setCurrentPageNo(pageNumber) {
//         setCurrentPage(pageNumber)
//     }


<<<<<<< HEAD
// <<<<<<< HEAD
//     const getProducts = async (page = 1, keyword = '', price) => {
// =======
//     const getphotos = async (page = 1, keyword = '', price, category='') => {
// >>>>>>> fb72baa71cd7cd99ffe6c10f58835e8fb5fae311
//         let link = ''

//         link = `${process.env.REACT_APP_API}/api/v1/photos/?page=${page}&keyword=${keyword}&price[lte]=${price[1]}&price[gte]=${price[0]}`
        
//         if (category) {
//             link = `${process.env.REACT_APP_API}/api/v1/photos?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}`
//         }

//         console.log(link)
//         let res = await axios.get(link)
//         console.log(res)
//         setphotos(res.data.photos)
//         setResPerPage(res.data.resPerPage)
//         setphotosCount(res.data.photosCount)
//         setfilteredPhotosCount(res.data.filteredPhotosCount)
//         setLoading(false)
//     }
//     useEffect(() => {
//         getphotos(currentPage, keyword, price, category)
//     }, [currentPage, keyword, price, category]);
=======
    const getProducts = async (page = 1, keyword = '', price) => {
    const getPhotos = async (page = 1, keyword = '', price, category='') => {
        let link = ''

        link = `${process.env.REACT_APP_API}/api/v1/photo/?page=${page}&keyword=${keyword}&price[lte]=${price[1]}&price[gte]=${price[0]}`
        
        if (category) {
            link = `${process.env.REACT_APP_API}/api/v1/photo?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}`
        }

        console.log(link)
        let res = await axios.get(link)
        console.log(res)
        setphotos(res.data.photos)
        setResPerPage(res.data.resPerPage)
        setphotosCount(res.data.photosCount)
        setfilteredPhotosCount(res.data.filteredPhotosCount)
        setLoading(false)
    }
    useEffect(() => {
        getPhotos(currentPage, keyword, price, category)
    }, [currentPage, keyword, price, category]);
>>>>>>> 25c5454ac200bab53ff1dcc0affbbe35c768be7e

//     let count = photosCount
//     if (keyword) {
//         count = filteredPhotosCount
//     }
//     return (
//         <>
//             {loading ? <Loader /> : (<Fragment>
//                 <MetaData title={'Buy Best photos Online'} />
//                 <div className="container container-fluid">

//                     <h1 id="photos_heading">Latest photos</h1>
//                     <section id="photos" className="container mt-5">
//                         <div className="row">
//                             {keyword ? (
//                                 <Fragment>
//                                     <div className="col-6 col-md-3 mt-5 mb-5">
//                                         <div className="px-5">
//                                             {/* <Range
//                                                 marks={{
//                                                     1: `$1`,
//                                                     1000: `$1000`
//                                                 }}
//                                                 min={1}
//                                                 max={1000}
//                                                 defaultValue={[1, 1000]}
//                                                 tipFormatter={value => `$${value}`}
//                                                 tipProps={{
//                                                     placement: "top",
//                                                     visible: true
//                                                 }}
//                                                 value={price}
//                                                 onChange={price => setPrice(price)}
//                                             /> */}
//                                             <hr className="my-5" />
//                                             <div className="mt-5">
//                                                 <h4 className="mb-3">
//                                                     Categories
//                                                 </h4>
//                                                 <ul className="pl-0">
//                                                     {categories.map(category => (
//                                                         <li
//                                                             style={{
//                                                                 cursor: 'pointer',
//                                                                 listStyleType: 'none'
//                                                             }}
//                                                             key={category}
//                                                             onClick={() => setCategory(category)}
//                                                         >
//                                                             {category}
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </div>

//                                         </div>
//                                     </div>

<<<<<<< HEAD
//                                     <div className="col-6 col-md-9">
//                                         <div className="row">
//                                             {photos.map(product => (
//                                                 <></>
//                                                 // <Product key={product._id} product={product} col={4} />
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </Fragment>
//                             ) : (
//                                 photos.map(product => (
//                                     <></>
//                                     // <Product key={product._id} product={product} col={3} />
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
=======
                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {photos.map(product => (
                                                <></>
                                                // <Product key={product._id} product={product} col={4} />
                                            ))}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                photos.map(product => (
                                    <></>
                                    // <Product key={product._id} product={product} col={3} />
                                ))
                            )}
                        </div>
                    </section>
                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
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
                        </div>)}
                </div>
            </Fragment>
            )}
        </>
    )
}}
>>>>>>> 25c5454ac200bab53ff1dcc0affbbe35c768be7e

// export default Home