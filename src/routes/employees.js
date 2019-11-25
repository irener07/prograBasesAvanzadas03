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

router.get('/employees/registerSite', (req, res) => {
    res.render('employees/registerSite');
});

router.get('/employees/query03', (req, res) => {
    session
        .run('MATCH (n: supermarket) RETURN n LIMIT 25')
        .then(function(result){
            var personArr = [];
            result.records.forEach(function(record){
                personArr.push({
                    id: record._fields[0].identity.low,
                    name: record._fields[0].properties.name
                });
            })
            res.render('AdminViews/graphQuery1View', { persons: personArr})
        })
        .catch(function(err){
            console.log(err);
        })
    res.render('employees/query03');
});

module.exports = router;
