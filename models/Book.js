const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    availableQuantity: {
        type: Number,
        required: true,
        default: 1
    },
    shelfLocation: {
        type: String,
        required: true
    },
    publishedYear: {
        type: Number
    },
    addedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', BookSchema);