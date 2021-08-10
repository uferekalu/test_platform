const mongoose = require('mongoose')

const TestSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    name: String,//React, BA
    questions: {
        type: Array
    },//["6e3ete6t4ett4", "6et6tet64te64"],
    passPercentage: {
        type: Number,
        required: true,
        default: 75
    },
    createdBy: String,
    logo: String
}, {timestamps: true})
module.exports = mongoose.model('Test', TestSchema)