const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const productsSchema = new Schema({
    idProduct: {
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
    price: {
        type: String,
        required: true
    },
    img: { 
        data: Buffer, 
        contentType: String 
    }

});

module.exports = mongoose.model("products", productsSchema);