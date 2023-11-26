import React, { Fragment, useState, useEffect, useRef } from 'react';
import MetaData from './Layout/MetaData';
import axios from 'axios';
import Photo from './Photo/Photo';
import Loader from './Layout/Loader';
import { useParams } from 'react-router-dom';

const Home = () => {
  let { keyword } = useParams();
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [resPerPage, setResPerPage] = useState(0);
  const [filteredPhotosCount, setFilteredPhotosCount] = useState(0);
  const [price, setPrice] = useState([1, 1000]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const sentinelRef = useRef(null);

  const getPhotos = async (page = 1, keyword = '', price) => {
    let link = `${process.env.REACT_APP_API}/api/v1/photos/?page=${page}&keyword=${keyword}`;
  
    try {
      let res = await axios.get(link);
      setPhotos((prevPhotos) => {
        const newPhotos = res.data.photos.filter(newPhoto => !prevPhotos.some(prevPhoto => prevPhoto._id === newPhoto._id));
        return [...prevPhotos, ...newPhotos];
      });
      setResPerPage(res.data.resPerPage);
      setFilteredPhotosCount(res.data.filteredPhotosCount);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  const handleIntersection = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      console.log('Intersection detected!');
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1); // Reset current page when search changes
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, 
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  useEffect(() => {
    getPhotos(currentPage, keyword, price);
  }, [currentPage, keyword, price, searchKeyword]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={'Buy Best Photos Online'} />
          <div className="container container-fluid">
            <h1 id="photos_heading">Latest Photos</h1>
            <div className="row justify-content-end">
              <div className="col-md-4 search-bar">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchKeyword}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <section id="photos" className="container mt-1">
              <div className="row">
                {photos
                  .filter((photo) =>
                    photo.name.toLowerCase().includes(searchKeyword.toLowerCase())
                  )
                  .map((photo) => (
                    <Photo
                      key={`${photo._id}-${photo.name}-${photo.timestamp}`}
                      photo={photo}
                      col={1}
                    />
                  ))}
              </div>
              <div ref={sentinelRef} style={{ height: '100px', width: '1px' }} />
            </section>
          </div>
        </Fragment>
      )}
    </>
  );
};

export default Home;
