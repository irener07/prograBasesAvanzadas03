const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const ordersSchema = new Schema({
    id: {
        type: Number,
        required: true, 
        unique: true
    },
    products: {
        type: Array,
        required: true
    },
    dateTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true
    },
    particularNeeds: {
        type: String,
        require: false
    },
    idClient:{
        type: String,
        required: true
    },
    idSuperMarket:{
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("orders", ordersSchema);