const mongoose = require('mongoose');
const config = require('./connectDB');
const db = config.mongoURI;

module.exports= () =>{
  mongoose
    .connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
}