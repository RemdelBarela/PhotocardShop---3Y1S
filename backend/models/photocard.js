const mongoose = require('mongoose')
const Photo = require('../models/photo')
const Material = require('../models/material')
const Photocard = require('../models/photocard')

const photocardSchema = new mongoose.Schema({
    photo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Photo',
        required: [true, 'Please select a photo for this product'],
    },
    material: {
        type: mongoose.Schema.ObjectId,
        ref: 'Material',
        required: [true, 'Please select a material for this product'],
    },

    // price: {
    //     type: Number,
    //     required: [true, 'PROVIDE PRODUCT PRICE'],
    //     minLength: [1, 'ENSURE YOUR PHOTOCARD PRICE HAS A MINIMUM VALUE OF 1 UNIT'],
    //     default: 1.0
    // },

    // description: {
    //     type: String,
    //     required: [true, 'PRODUCT DESCRIPTION IS REQUIRED'],
    // },

    // seller: {
    //     type: String,
    //     required: [true, 'PROVIDE THE PRODUCT SELLER INFORMATION']
    // },

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
    ratings: {
        type: Number,
        default: 0
    },
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
    createdAt: {
        type: Date,
        default: Date.now
    }
})

photocardSchema.pre('validate', async function (next) {
    try {
      const material = await Material.findById(this.material);
      const photo = await Photo.findById(this.photo);
  
      if (!photo) {
        this.invalidate('photo', 'Please provide a valid photo for this product');
      }

      if (!material) {
        this.invalidate('material', 'Please select a valid material for this product');
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });

module.exports = mongoose.model('Photocard', photocardSchema);
module.exports = { Photo, Material, Photocard };