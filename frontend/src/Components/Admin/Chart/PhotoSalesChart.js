import React, { useState, useEffect } from 'react'
import { getToken } from '../../../utils/helpers';
import axios from "axios";
import Loader from '../../Layout/Loader'

import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function PhotoSalesChart({ data }) {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const pieColors = [
        "#FF0000",
        "#B30000",
        "#800000",
        "#4D0000",
        "#330000",
        "#FF3333",
        "#CC0000",
        "#990000",
        "#660000",
        "#330000",
        "#000000",
        "#262626",
        "#4D4D4D",
        "#666666",
        "#808080",
        "#999999",
        "#B2B2B2",
        "#CCCCCC",
        "#E6E6E6"
    ];
    
    // console.log(data)

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(2)}%`}
            </text>
        );
    };

    const photoSales = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/photo-sales`, config)
            setSales(data.totalSales)
            
        } catch (error) {
            setError(error.response.data.message)
            
        }
    }

    useEffect(() => {
        photoSales()
    }, [])


    return (
        <ResponsiveContainer width="90%" height={1000}>
            <PieChart width={1000} height={1000}>
                <Pie
                    dataKey="percent"
                    nameKey="name"
                    isAnimationActive={true}
                    data={sales}
                    cx="50%"
                    cy="50%"
                    outerRadius={300}
                    fill="#8884d8"
                    label={renderCustomizedLabel}
                    labelLine={false}
                >
                   {
                        sales.map((entry, index) => <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />)
                    }
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="top" align="center" />
            </PieChart>
        </ResponsiveContainer>
    );
}