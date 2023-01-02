const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    tokennumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    senderavatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;

