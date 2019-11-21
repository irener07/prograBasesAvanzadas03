const passport = require ('passport');
const passportLocal = require('passport-local').Strategy;
const mongoose = require('mongoose');
const client = require('../models/clients'); 
const employee = require('../models/employees'); 


passport.use(new passportLocal({
    usernameField: 'email'
  }, async (email, password, type, done) => {
    const user;
    const match
    if(type=="Client"){
        user = await client.findOne({email: email});
        match = await user.matchPassword(password);
    }
    if(type=="Employee"){

    }
    if(type=="Manager"){

    }
    if (!user) {
      return done(null, false, { message: 'Not User found.' });
    } else {
      if(match) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect Password.' });
      }
    }
  
  }));


  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    client.findById(id, (err, user) => {
      done(err, user);
    });
  });