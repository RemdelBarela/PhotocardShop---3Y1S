const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'PROVIDE MATERIAL NAME'],
        trim: true,
        maxLength: [50, 'ENSURE YOUR MATERIAL NAME HAS A MAXIMUM LENGTH OF 50 CHARACTERS']
    },
    
    stock: {
        type: Number,
        required: [true, 'PROVIDE MATERIAL NAME'],
        maxLength: [5, 'ENSURE YOUR STOCK HAS A MAXIMUM LENGTH OF 5 CHARACTERS'],
        default: 0
    },
})

module.exports = mongoose.model('Product', productSchema);