const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    photo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Photo',
        required: [true, 'PLEASE SELECT A PHOTO TO BE ADDED TO CART'],
    },

    rev: [
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
    
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Review', reviewSchema);