import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getToken } from '../../../utils/helpers';
import axios from 'axios';
import Loader from '../../Layout/Loader';

export default function OrderStatusChart() {
    const [orderStatusCounts, setOrderStatusCounts] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrderStatusCounts = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/order-status-counts`, config);
            setOrderStatusCounts(data.statusPercentage);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchOrderStatusCounts();
    }, []);

    return (
        <ResponsiveContainer width="70%" height={700}>
            {loading ? (
                <Loader />
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <LineChart width={600} height={300} data={orderStatusCounts} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="percent" stroke="#FF0000" fill="#FF0000" strokeWidth={8} />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"  strokeWidth={4}/>
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            )}
        </ResponsiveContainer>
    );
}
