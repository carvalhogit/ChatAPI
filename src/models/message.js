const mongoose = require('mongoose');
const {resolve} = require('path');

require('dotenv').config({ path: resolve(__dirname, `../../.env`)});

const messageSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
        unique: true,
    },
    time: {
        type: String,
        required: true,
    }
});

const MessageModel = mongoose.model('Message', userSchema);

module.exports = MessageModel;