const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const supermarketsSchema = new Schema({
    idSuperMarket: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false,
        data: Buffer
    },
    telephone: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    schedule: {
        type: Object,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        required: true
    }

});

module.exports = mongoose.model("supermarkets", supermarketsSchema);