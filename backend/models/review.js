const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    photo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Photo',
        required: [true, 'PLEASE SELECT A PHOTO TO BE ADDED TO CART'],
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Review', reviewSchema);