const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
mongoose.set('useCreateIndex', true);

const clientPhoneNumbersSchema = new Schema({
    telephones: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model("clientsPhoneNumbers",clientPhoneNumbersSchema);

const clientsSchema = new Schema({
    id: {
        type: String,
        required: true, 
        unique: true
    },
    firstName: {
        type: String,
        required: true, 
    },
    lastName: {
        type: String,
        required: true, 
    },
    birthDate: {
        type: Date,
        required: true
    },
    nationality: {
        type: String,
        required: true, 
    },
    country: {
        type: String,
        required: true, 
    },
    state: {
        type: String,
        required: true, 
    },
    address: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true, 
    },
    password: {
        type: String,
        required: true, 
    },
    telephone: {
        type: Array,
        required: true,
    }
});

clientsSchema.methods.encryptPassword=async(password) =>{
   const salt= await bcrypt.genSalt(11);
   const hash = bcrypt.hash(password,salt);
   return hash;
};

clientsSchema.methods.matchPassword= async function(password){
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("clients",clientsSchema);