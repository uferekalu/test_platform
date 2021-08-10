const mongoose = require('mongoose')

const TestCategorySchema = new mongoose.Schema({
    name: String,//React, BA
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
}, {timestamps: true})

module.exports = mongoose.model('Category', TestCategorySchema)