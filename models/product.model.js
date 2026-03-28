const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: String,
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    imgURL: String,
    slug: {
        type: String,
        unique: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);