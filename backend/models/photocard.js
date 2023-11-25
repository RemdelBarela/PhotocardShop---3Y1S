const mongoose = require('mongoose')
const Photo = require('../models/photo')
const Material = require('../models/material')
const Photocard = require('../models/photocard')

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

    quantity: {
        type: Number,
        required: [true, 'PROVIDE PHOTOCARD QUANTITY'],
        minLength: [1, 'ENSURE YOUR QUANTITY HAS A MINIMUM VALUE OF 1 PHOTOCARD'],
        default: 1
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
module.exports = mongoose.model('Photocard', photocardSchema);