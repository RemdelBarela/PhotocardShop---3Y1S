const mongoose = require('mongoose')

const photocardSchema = new mongoose.Schema({
    photo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Photo',
        required: [true, 'PLEASE SELECT A PHOTO TO BE ADDED TO CART'],
    },
    material: {
        type: mongoose.Schema.ObjectId,
        ref: 'Material',
        required: [true, 'PLEASE SELECT A MATERIAL TO BE ADDED TO CART'],
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Photocard', photocardSchema);