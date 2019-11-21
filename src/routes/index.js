const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const client = require('../models/clients');
const employee = require('../models/employees');
const dataUserConnected = require('../configuration/connectDB');



router.get('/', (req, res) => {
    dataUserConnected.idUserConnected='';
    dataUserConnected.typeUser='';
    res.render('index');
});

router.post('/', async (req, res) => {
  const {email, password, typeUser}= req.body;
  const errors=[];
  if(email=='' || password==''){
      errors.push({text: 'Please, Insert the Data'});
  }
  if(errors.length>0){
      res.render('index',{errors, email, password});
  }
  else{    
    if(typeUser=="Client"){
      const user = await client.findOne({email: email});
      if(user){
        const match = await user.matchPassword(password);
        if(match){
          dataUserConnected.typeUser="Client";
          dataUserConnected.idUserConnected=user.id;
          res.redirect('clients/clientsModule');
        } else{
          errors.push({text: 'The Password or Email or Type are Incorrect.'});
          res.render('index',{errors, email, password});
        } 
      }
      else{
        errors.push({text: 'The Type are Incorrect.'});
        res.render('index',{errors, email, password});
      }
    }
    if(typeUser=="Employee"){
      const user = await employee.findOne({email: email});
      if(user){
        const match = await user.matchPassword(password);
        if(match){
          const type= user.type;
          if(type!="Manager"){
            dataUserConnected.typeUser="Employee";
            dataUserConnected.idUserConnected=user.id;
            res.redirect('employees/employeesModule');
          }
          else{
            errors.push({text: 'The Type are Incorrect.'});
            res.render('index',{errors, email, password});}
        } else{
          errors.push({text: 'The Type are Incorrect.'});
          res.render('index',{errors, email, password});
        } 
      }
    }
  }
});

  

module.exports = router;