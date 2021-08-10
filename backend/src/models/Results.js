const mongoose = require('mongoose')


const ResultsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Test',
    },
    answers: [
        {
            questionId: {
                type: String,
                required: true
            },
            answer: String,//null
            isCorrect: {
                type: Boolean,
                required: true
            },
            timeTaken: {
                type: Number,
                required: true
            }
        }
    ],
    //Based on pre decided percentage cutout
    correctAnsweredCount: {
        type: Number,
        required: true
    },
    attempt: {
        type: Number,
        required: true,
        default: 1
    },
    isPassed: {
        type: Boolean,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
}, {timestamps: true})
module.exports = mongoose.model('Result', ResultsSchema)