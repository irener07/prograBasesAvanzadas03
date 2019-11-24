const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
mongoose.set('useCreateIndex', true);



const savesSitesSchema = new Schema({
    idClient: {
        type: Number,
        required: true,
    },

    idSuperMarket: {
        type: String,
        required: true
    },

    sites: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model("savedSites",savesSitesSchema);