import React, { Fragment, useState, useEffect } from 'react'

import MetaData from './Layout/MetaData'
import axios from 'axios'
import Pagination from 'react-js-pagination'
import Photo from './Photo/Photo'
import Loader from './Layout/Loader'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useParams } from "react-router-dom"

const Home = () => {
    let { keyword } = useParams()
    const [loading, setLoading] = useState(true)
    const [photos, setPhotos] = useState([])
    const [error, setError] = useState()
    const [photosCount, setPhotosCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [resPerPage, setResPerPage] = useState(0)
    const [filteredPhotosCount, setFilteredPhotosCount] = useState(0)
    const [price, setPrice] = useState([1, 1000]);


    // const createSliderWithTooltip = Slider.createSliderWithTooltip;
    // const Range = createSliderWithTooltip(Slider.Range);

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }


    const getPhotos = async (page = 1, keyword = '', price) => {
        let link = ''

        link = `${process.env.REACT_APP_API}/api/v1/photos/?page=${page}&keyword=${keyword}&price[lte]=${price[1]}&price[gte]=${price[0]}`

        console.log(link)
        let res = await axios.get(link)
        console.log(res)
        setPhotos(res.data.photos)
        setResPerPage(res.data.resPerPage)
        setPhotosCount(res.data.photosCount)
        setFilteredPhotosCount(res.data.filteredPhotosCount)
        setLoading(false)
    }
    useEffect(() => {
        getPhotos(currentPage, keyword, price)
    }, [currentPage, keyword, price]);

    let count = photosCount
    if (keyword) {
        count = filteredPhotosCount
    }
    return (
        <>
            {loading ? <Loader /> : (<Fragment>
                <MetaData title={'Buy Best Photos Online'} />
                <div className="container container-fluid">

                    <h1 id="photos_heading">Latest Photos</h1>
                    <section id="photos" className="container mt-5">
                        <div className="row">
                            {keyword ? (
                                <Fragment>
                                    {/* <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                            <Range
                                                marks={{
                                                    1: `$1`,
                                                    1000: `$1000`
                                                }}
                                                min={1}
                                                max={1000}
                                                defaultValue={[1, 1000]}
                                                tipFormatter={value => `$${value}`}
                                                tipProps={{
                                                    placement: "top",
                                                    visible: true
                                                }}
                                                value={price}
                                                onChange={price => setPrice(price)}
                                            />
                                            <hr className="my-5" />
                                            

                                        </div>
                                    </div> */}

                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {photos.map(photo => (
                                                <Photo key={photo._id} photo={photo} col={4} />
                                            ))}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                photos.map(photo => (
                                    <Photo key={photo._id} photo={photo} col={3} />
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
}

export default Home