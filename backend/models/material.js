const mongoose = require('mongoose')

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'PROVIDE MATERIAL NAME'],
        trim: true,
        maxLength: [50, 'ENSURE YOUR MATERIAL NAME HAS A MAXIMUM LENGTH OF 50 CHARACTERS']
    },
    stock: {
        type: Number,
        required: [true, 'PROVIDE MATERIAL STOCK'],
        maxLength: [5, 'ENSURE YOUR STOCK HAS A MAXIMUM LENGTH OF 5 CHARACTERS'],
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

module.exports = mongoose.model('Material', materialSchema);