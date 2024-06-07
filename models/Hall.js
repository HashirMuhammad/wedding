const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    dimensions: {
        type: String,
        required: true
    },
    userid: {
        type: String,
    },
});

const Hall = mongoose.model('Hall', hallSchema);

module.exports = Hall;
