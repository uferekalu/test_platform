const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    description: String,
    alternatives: [
        {
            text: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
}, {timestamps: true})

module.exports = mongoose.model('Question', QuestionSchema)