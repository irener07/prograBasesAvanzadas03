const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const supermarketsSchema = new Schema({
    idSuperMarket: {
        type: String,
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
    address: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    typeSupermarket: {
        type: Array,
        required: true
    },
    image: {
        type: Object,
        required: false
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