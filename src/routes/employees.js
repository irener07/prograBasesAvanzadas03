const express = require('express');
const router = express.Router();
const employees = require('../models/employees');

router.get('/employees/signUpEmployees', (req, res) => {
    res.render('employees/signUpEmployees');
  });

router.get('/employees/employeesModule', (req, res) => {
    res.render('employees/employeesModule');
});

router.post('/employees/signUpEmployees', async (req, res) => {
    const { id, firstName, lastName, email, password }= req.body;
    const errors=[];
    if(id=='' || firstName=='' ||  lastName=='' ||  password=='' 
    ||  email==''){
        errors.push({text: 'Please, Insert the complete Data'});
    }
    if(errors.length>0){
        res.render('employees/signUpEmployees',{errors, id, firstName, lastName, email, password });   }
            
        else{
            const idE = await employees.findOne({id: id});
            const emailEmployee = await employees.findOne({email: email});
            if (emailEmployee || idE){
                req.flash('error_msg', 'The ID or Email is Already Registered');
                res.redirect('/employees/signUpEmployees');
            }

            const newEmployee = new employees( {id, firstName, lastName, email, password } );
            newEmployee.password = await newEmployee.encryptPassword(password);
            await newEmployee.save();
            req.flash('success_msg', 'Successful Registration');
            res.redirect('/employees/employeesModule');
    
        } 
});



module.exports = router;
