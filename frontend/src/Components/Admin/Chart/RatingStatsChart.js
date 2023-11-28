import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getToken } from '../../../utils/helpers';
import axios from 'axios';
import Loader from '../../Layout/Loader';

const RatingStatsChart = () => {
    const [ratingStats, setRatingStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchRatingStats = async () => {
        try {
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${getToken()}`,
            },
          };
  
          const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/rating-stats`, config);
          setRatingStats(data.ratingStats); // Adjust the key based on your response structure
          setLoading(false);
        } catch (error) {
          setError(error.response.data.message);
        }
      };
  
      fetchRatingStats();
    }, []);
  
    return (
      <ResponsiveContainer width="70%" height={400}>
        {loading ? (
          <Loader />
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <LineChart data={ratingStats}>
            <Line type="monotone" dataKey="averageRating" stroke="#FF0000" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="photoDetails.name" /> {/* Adjust the key based on your response structure */}
            <YAxis />
            <Tooltip />
          </LineChart>
        )}
      </ResponsiveContainer>
    );
  };
  
  export default RatingStatsChart;