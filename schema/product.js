let mongoose = require('mongoose');
let productSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    quantity: {
        type: Number,
        require: true,
        min: 0,
    },
    price: {
        type: Number,
        min: 0,
        require: true
    },
    description: {
        type: String,
        default: ""
    },
    imageURL: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        require: true
    }

}, { timestamps: true })
module.exports = mongoose.model('product', productSchema)