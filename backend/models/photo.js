const mongoose = require('mongoose')

const photoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'PROVIDE PRODUCT NAME'],
        trim: true,
        maxLength: [50, 'ENSURE YOUR PRODUCT NAME HAS A MAXIMUM LENGTH OF 50 CHARACTERS']
    },
    price: {
        type: Number,
        required: [true, 'PROVIDE PRODUCT PRICE'],
        maxLength: [5, 'ENSURE YOUR PRODUCT PRICE HAS A MAXIMUM LENGTH OF 5 CHARACTERS'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'PRODUCT DESCRIPTION REQUIRED'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    material: {
        type: mongoose.Schema.ObjectId,
        ref: 'Material',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Photo', photoSchema);