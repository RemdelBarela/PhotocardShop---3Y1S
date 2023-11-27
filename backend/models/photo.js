const mongoose = require('mongoose')

const photoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'PROVIDE PHOTO NAME'],
        trim: true,
        maxLength: [50, 'ENSURE YOUR PRODUCT NAME HAS A MAXIMUM LENGTH OF 50 CHARACTERS']
    },
    price: {
        type: Number,
        required: [true, 'PROVIDE PHOTO PRICE'],
        maxLength: [5, 'ENSURE YOUR PHOTO PRICE HAS A MAXIMUM LENGTH OF 5 CHARACTERS'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'PHOTO DESCRIPTION REQUIRED'],
    },
    numOfReviews: {
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
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Photo', photoSchema);