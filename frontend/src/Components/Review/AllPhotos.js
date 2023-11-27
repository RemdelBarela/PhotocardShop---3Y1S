import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllPhotos = ({ handlePhotoChange }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPhotos = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/allphotos`);
            setPhoto(response.data.getAllPhotos);
        } catch (error) {
            console.error('ERROR GETTING PHOTOS:', error);
        }
    };

    fetchPhotos();
  }, []);

  return (
    <div>
      <h5><strong>Choose Photo:</strong></h5>
      {loading ? (
        <p>Loading photos...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <select
          id="photo_dropdown"
          className="form-control"
          onChange={(e) => handlePhotoChange(JSON.parse(e.target.value))}
        >
          <option value="" disabled>
            CHOOSE PHOTO
          </option>
          {photos.map((photo) => (
            <option key={photo._id} value={JSON.stringify(photo)}>
              {photo.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AllPhotos;
