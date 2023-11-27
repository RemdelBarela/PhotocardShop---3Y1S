const Order = require('../models/order');
const User = require('../models/user');
const Photo = require('../models/photo');
const Photocard = require('../models/photocard');
const Material = require('../models/material');
const sendShippedEmail = require('../utils/sendShippedEmail')
const sendDeliveredEmail = require('../utils/sendDeliveredEmail')

exports.newOrder = async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    if (!order) {
        return res.status(400).json({ message: `ORDER NOT SAVED` })
    }

    res.status(200).json({
        success: true,
        order
    })
}

exports.getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return res.status(404).json({ message: `No Order found with this ID` })
    }
    res.status(200).json({
        success: true,
        order
    })
}

exports.myOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })

    if (!orders) {
        return res.status(404).json({ message: `Order found` })
    }

    res.status(200).json({
        success: true,
        orders
    })
}

exports.allOrders = async (req, res, next) => 
{
    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
}
// Assuming you have a sendEmail function defined elsewhere

exports.updateOrder = async (req, res, next) => {
    
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate('orderItems.photocard');

        console.log('Retrieved Order:', order);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.orderStatus === 'Delivered') {
            return res.status(400).json({ message: 'This order has already been delivered' });
        }

        // Update order status and deliveredAt time
        order.orderStatus = req.body.status;
        order.deliveredAt = Date.now();
        await order.save();

        try {
        // Send email notifications based on the updated order status
        if (order.orderStatus === 'Shipped') {
            for (const orderItem of order.orderItems) {
                const photocard = orderItem.photocard;

                if (!photocard) {
                    throw new Error('Photocard not found');
                }

                const material = await Material.findById(photocard.material);

                if (!material) {
                    throw new Error('Material not found');
                }

                // Deduct the quantity of the order item from the material stock
                material.stock -= orderItem.quantity;
                await material.save();
            }
        }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        

       
            const user = await User.findById(order.user);

            if (user) {
                const pdfLink = `${req.protocol}://localhost:3000/print-receipt/${orderId}`;
                let message = '';

                if (order.orderStatus === 'Shipped') {
                    message = `Your order with ID ${orderId} has been shipped. Thank you for shopping with us!\n\n<a href="${pdfLink}">Download Receipt</a>`;
                    await sendShippedEmail({
                        email: user.email,
                        subject: 'Order Shipped Notification',
                        message
                    });
                } else if (order.orderStatus === 'Delivered') {
                    message = `The order with ID ${orderId} has been delivered. \n\n<a href="${pdfLink}">Download Receipt</a>`;
                    await sendDeliveredEmail({
                        email: user.email,
                        subject: 'Order Completed Notification',
                        message
                    });
                }
            }
        

        res.status(200).json({ success: true });
   
};



exports.deleteOrder = async (req, res, next) => {

    const order = await Order.findByIdAndDelete(req.params.id)

    if (!order) {
        return res.status(404).json({ message: `No Order found with this ID` })

    }

    res.status(200).json({
        success: true
    })
}

exports.getReceipt = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return res.status(404).json({ message: `No Order found with this ID` })
    }
    res.status(200).json({
        success: true,
        order
    })
}

exports.totalOrders = async (req, res, next) => {
    const totalOrders = await Order.aggregate([
        {
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        }
    ])
    if (!totalOrders) {
        return res.status(404).json({
            message: 'ERROR TOTAL ORDERS',
        })
    }
    res.status(200).json({
        success: true,
        totalOrders
    })

}

exports.totalSales = async (req, res, next) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$totalPrice" }
            }
        }
    ])
    if (!totalSales) {
        return res.status(404).json({
            message: 'ERROR TOTAL SALES',
        })
    }
    res.status(200).json({
        success: true,
        totalSales
    })
}

exports.customerSales = async (req, res, next) => {
    const customerSales = await Order.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            },
        },
        // {
        //     $group: {
        //         _id: "$user",
        //         total: { $sum: "$totalPrice" },
        //     }
        // },

        { $unwind: "$userDetails" },
        // {
        //     $group: {
        //         _id: "$user",
        //         total: { $sum: "$totalPrice" },
        //         doc: { "$first": "$$ROOT" },

        //     }
        // },

        // {
        //     $replaceRoot: {
        //         newRoot: { $mergeObjects: [{ total: '$total' }, '$doc'] },
        //     },
        // },
        {
            $group: {
                _id: "$userDetails.name",
                total: { $sum: "$totalPrice" }
            }
        },
        {
            $project: {
                _id: 0,
                "userDetails.name": 1,
                total: 1,
            }
        },
        { $sort: { total: 1 } },

    ])
    console.log(customerSales)
    if (!customerSales) {
        return res.status(404).json({
            message: 'error customer sales',
        })


    }
    // return console.log(customerSales)
    res.status(200).json({
        success: true,
        customerSales
    })

}
exports.salesPerMonth = async (req, res, next) => {
    const salesPerMonth = await Order.aggregate([

        {
            $group: {
                // _id: {month: { $month: "$paidAt" } },
                _id: {
                    year: { $year: "$paidAt" },
                    month: { $month: "$paidAt" }
                },
                total: { $sum: "$totalPrice" },
            },
        },

        {
            $addFields: {
                month: {
                    $let: {
                        vars: {
                            monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', ' Sept', 'Oct', 'Nov', 'Dec'],
                            
                        },
                        in: {
                            $arrayElemAt: ['$$monthsInString', "$_id.month"]
                        }
                    }
                }
            }
        },
        { $sort: { "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                month: 1,
                total: 1,
            }
        }

    ])
    if (!salesPerMonth) {
        return res.status(404).json({
            message: 'error sales per month',
        })
    }
    // return console.log(customerSales)
    res.status(200).json({
        success: true,
        salesPerMonth
    })

}

exports.orderStatusCounts = async (req, res, next) => {
    try {
        const orderCounts = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                },
            },
        ]);

        if (!orderCounts) {
            return res.status(404).json({
                message: 'Error fetching order counts'
            });
        }

        let totalCount = orderCounts.reduce((total, status) => total + status.count, 0);

        let statusPercentage = orderCounts.map(item => {
            percent = Number(((item.count / totalCount) * 100).toFixed(2));
            total = {
                status: item._id,
                percent
            };
            return total;
        });

        res.status(200).json({
            success: true,
            statusPercentage,
            orderCounts,
            totalCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
