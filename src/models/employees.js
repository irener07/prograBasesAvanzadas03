const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
mongoose.set('useCreateIndex', true);

const employeesSchema = new Schema({
    id: {
        type: String,
        required: true, 
        unique: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }
});

employeesSchema.methods.encryptPassword=async(password) =>{
    const salt= await bcrypt.genSalt(11);
    const hash = bcrypt.hash(password,salt);
    return hash;
 };
 
 employeesSchema.methods.matchPassword= async function(password){
     return await bcrypt.compare(password, this.password);
 };

module.exports = mongoose.model("employees", employeesSchema);