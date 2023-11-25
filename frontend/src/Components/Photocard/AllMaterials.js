import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllMaterials = ({ handleMaterialChange }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/allmaterials`);
        setMaterials(response.data.allmaterials);
        setLoading(false);
      } catch (error) {
        console.error('ERROR FETCHING MATERIALS:', error);
        setError('ERROR FETCHING MATERIALS. PLEASE TRY AGAIN.');
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  return (
    <div>
      <h5><strong>Choose Material:</strong></h5>
      {loading ? (
        <p>Loading materials...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          {materials.map((material) => (
            <div key={material._id}>
              <input
                type="radio"
                id={`matRadio${material._id}`}
                name="matRadio"
                value={material.name}
                onChange={() => handleMaterialChange(material)}
              />
              <label htmlFor={`matRadio${material._id}`}>{material.name}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllMaterials;
