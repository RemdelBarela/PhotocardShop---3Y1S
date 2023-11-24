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
        console.error('Error fetching materials:', error);
        setError('Error fetching materials. Please try again.');
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  return (
    <div>
      <h2>Choose Material:</h2>
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
                onChange={() => handleMaterialChange(material.name)}
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
