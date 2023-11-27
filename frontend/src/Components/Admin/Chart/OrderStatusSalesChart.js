import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Label} from 'recharts';
import { getToken } from '../../../utils/helpers';
import axios from 'axios';
import Loader from '../../Layout/Loader';

const OrderStatusChart = () => {
    const [orderStatusCounts, setOrderStatusCounts] = useState('');
    const [activeIndex, setActiveIndex] = useState(null);
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

    const handleMouseEnter = (_, index) => {
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };

    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        return (
            <text x={x} y={y} fill="#FFF" textAnchor="middle" dominantBaseline="central">
                {`${(percent * 100).toFixed(2)}%`}
            </text>
        );
    };

    return (
        <ResponsiveContainer width="70%" height={700} onMouseLeave={handleMouseLeave}>
            {loading ? (
                <Loader />
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <PieChart>
                    <Pie
                        data={orderStatusCounts}
                        dataKey="percent"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={330}
                        label={renderCustomizedLabel}
                        activeIndex={activeIndex}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {
                            orderStatusCounts.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === activeIndex ? '#000000' : '#FF0000'} />
                            ))
                        }
                        <Label
                            content={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                                return (
                                    <text x={x} y={y} fill="#FFF" textAnchor="middle" dominantBaseline="central">
                                        {`${(percent * 100).toFixed(2)}%`}
                                    </text>
                                );
                            }}
                        />
                    </Pie>
                    <Tooltip />
                </PieChart>
            )}
        </ResponsiveContainer>
    );
};

export default OrderStatusChart;
