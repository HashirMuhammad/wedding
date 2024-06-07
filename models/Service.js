const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    userid: {
        type: String,
      },
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
