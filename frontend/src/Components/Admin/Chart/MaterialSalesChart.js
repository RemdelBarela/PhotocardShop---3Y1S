import React, { useState, useEffect } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getToken } from '../../../utils/helpers';
import axios from "axios";
import Loader from '../../Layout/Loader';

export default function MaterialSalesChart() {
    const [sales, setSales] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const materialSales = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/total-orders`, config)
            setSales(data.totalOrders)
            setLoading(false)

        } catch (error) {
           setError(error.response.data.message)
        }
    }
    useEffect(() => {
        materialSales()
       
    }, [])

    return (
        <ResponsiveContainer width="90%" height={500}>
            <LineChart width={600} height={300} data={sales} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="Total" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="count" />
                <YAxis />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    );
}