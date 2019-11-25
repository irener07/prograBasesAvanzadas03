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
            ordersFound.push(record._fields[0].properties);
        })
        res.render('employees/query01',{ordersFound});
    })

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

router.get('/employees/query04', async (req, res) => {
    migration();
    res.render('employees/query04');
});

router.get('/employees/query05', async (req, res) => {
    res.render('employees/query05');
});

router.post('/employees/query04', async (req, res) => {
    const {client}= req.body;
    session
    .run('MATCH p=({id:{idParam}})-[r:orderClient]->() RETURN p LIMIT 25',{idParam: client })
    .then( async function(result){
        var superMar = [];
        result.records.forEach( async function(record) {
            var nodeA = record.get('p');
            superMar.push(nodeA.end.properties.idSuperMarket);
        })
        session
        .run('MATCH (n:orders) RETURN n LIMIT 25',)
        .then( async function(result){
            var orders = [];
            result.records.forEach( async function(record) {
                var nodeB = record.get('n');
                orders.push(nodeB.properties);
            })
            session
            .run('MATCH (m:clients) RETURN m LIMIT 25',)
            .then( async function(result){
                var clients = [];
                result.records.forEach( async function(record) {
                    var nodeC = record.get('m');
                    clients.push(nodeC.properties);
                })
                var clientsFound = [];
                for (i=0; i<superMar.length;i++){
                    for(j=0; j<orders.length;j++){
                        if(superMar[i]==orders[j].idSuperMarket && orders[j].idClient!=client){
                            for(n=0; n<clients.length;n++){
                                if(orders[j].idClient==clients[n].id){
                                    clientsFound.push(clients[n]);
                                }
                            }
                        }
                    }
                }
                for(var l=0;l<clientsFound.length;l++){
                    for(var n=0;n<clientsFound.length;n++){
                        if(clientsFound[l]!=undefined && clientsFound[n]!=undefined && clientsFound[n].id==clientsFound[l].id){
                            if(n!=l){
                                delete clientsFound[n];
                            }
                        }
                    }
                }
                res.render('employees/query04',{clientsFound});
            })
            .catch(function(err){
                console.log(err);
            })
        })
        .catch(function(err){
            console.log(err);
        })
    })
    .catch(function(err){
        console.log(err);
    })
});

module.exports = router;