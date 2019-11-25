const express = require('express');
const router = express.Router();
const employees = require('../models/employees');
const supermarkets = require('../models/supermarkets');
const migration = require('../configuration/migration');
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'Abcd1234'));
const session = driver.session();

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

router.get('/employees/query01', (req, res) => {
    res.render('employees/query01');
});

router.post('/employees/query01', async (req, res) => {
    migration();
    const {idClientP} = req.body;
    session
    .run('MATCH (c:orders) where c.idClient = "'+idClientP+'" RETURN c LIMIT 25')
    .then(function(result){
        var ordersFound = [];
        result.records.forEach(function(record){
            ordersFound.push({
                idProduct: record._fields[0].properties.idProduct,
                totalAmount: record._fields[0].properties.totalAmount,
                idClient: record._fields[0].properties.idClient,
                dateTime: record._fields[0].properties.dateTime, 
                particularNeeds: record._fields[0].properties.particularNeeds,
                idSuperMarket: record._fields[0].properties.idSuperMarket,
                idOrden: record._fields[0].properties.idOrden,
                status: record._fields[0].properties.status
            });
        })
    })
        res.render('employees/query01',{ordersFound});
});

router.get('/employees/query02', async (req, res) => {
    migration();
    session
    .run('MATCH p=()-[r:orderSupermarket]->() RETURN p LIMIT 25')
    .then( async function(result){
        var superMar = [];
        result.records.forEach( async function(record) {
            var nodeA = record.get('p');
            superMar.push(nodeA.start.properties.idSuperMarket);
        })
        const supermarketsFound = await supermarkets.find({idSuperMarket:{$in:superMar}});
        res.render('employees/query02',{supermarketsFound});
    })
    .catch(function(err){
        console.log(err);
    })

});



router.get('/employees/employeesModule', (req, res) => {
    res.render('employees/employeesModule');
});

module.exports = router;


