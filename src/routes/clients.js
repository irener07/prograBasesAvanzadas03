const express = require('express');
const router = express.Router();
const clients = require('../models/clients');
const fs = require('fs');
const orders = require('../models/orders');
const supermarkets = require('../models/supermarkets');
const products = require('../models/products');
const dataUserConnected = require('../configuration/connectDB');


router.get('/clients/signUpClients', (req, res) => {
    res.render('clients/signUpClients');
});

router.post('/clients/signUpClients', async (req, res) => {
    const {id, firstName, lastName, birthDate, email, password, telephone}= req.body;
    const errors=[];
    if(id=='' || firstName=='' || lastName=='' || email=='' || password=='' || telephone==''){
        errors.push({text: 'Please, Insert the Data'});
    }
    if(errors.length>0){
        res.render('clients/signUpClients',{errors, id, firstName, lastName, birthDate, email, password, telephone});
    }
    else{
        const idC = await clients.findOne({id: id});
        const emailClient = await clients.findOne({email: email});
        if (emailClient || idC){
            req.flash('error_msg', 'The ID or Email is Already Registered');
            res.redirect('/clients/signUpClients');
        }
        const newClient = new clients({id, firstName, lastName, birthDate, email, password, telephone});
        newClient.password = await newClient.encryptPassword(password);
        await newClient.save();
        req.flash('success_msg', 'Successful Registration');
        res.redirect('/');
    }
});

router.get('/clients/clientsModule', (req, res) => {
    res.render('clients/clientsModule');
});

router.get('/clients/registerOrder', async (req, res) => {
    const superMarkets = await supermarkets.find();
    res.render('clients/registerOrder',{superMarkets});
});

router.post('/clients/registerOrder', async (req, res) => {
    const {superMarket}= req.body;
    const {superM} = superMarket;
    const superMarkets = await supermarkets.find();
    var productsSupermarket = await supermarkets.findOne({idSuperMarket: superMarket});
    productsSupermarket = await productsSupermarket.products;
    var paths = [];
    for (i=0; i<productsSupermarket.length; i++){
        var path = 'C:/images/'+i+'.jpeg';
        var data = productsSupermarket[i].img.data.buffer;
        var thumb = new Buffer.from(data, 'base64');
        fs.writeFile(path,thumb,function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("Succesful");
            }
        });
        productsSupermarket[i].img.contentType = path.replace('/','\\');
        paths.push({path:path});
    };
    res.render('clients/registerOrder',{superMarkets, superM, productsSupermarket});
});


router.post('/clients/registerOrder/confirmed', async (req, res) => {
    //const {products,superM,status,particularNeeds}= req.body;
    var scraper = require('table-scraper');
    scraper
    .get('C:\\Users\\ronal\\OneDrive\\Escritorio\\PP03BDA\\prograBasesAvanzadas03\\src\\views\\clients\\registerOrder.hbs')
    .then(function(tableData) {
    /*
       tableData === 
        [ 
          [ 
            { State: 'Minnesota', 'Capitol City': 'Saint Paul', 'Pop.': '3' },
            { State: 'New York', 'Capitol City': 'Albany', 'Pop.': 'Eight Million' } 
          ] 
        ]
    */
    console.log(tableData);
    });


/*     const superMarkets = await supermarkets.find();
    var productsSupermarket = await supermarkets.findOne({idSuperMarket: superMarket});
    productsSupermarket = await productsSupermarket.products;
    var paths = [];
    for (i=0; i<productsSupermarket.length; i++){
        var path = 'C:/images/'+i+'.jpeg';
        var data = productsSupermarket[i].img.data.buffer;
        var thumb = new Buffer.from(data, 'base64');
        fs.writeFile(path,thumb);
        productsSupermarket[i].img.contentType = path.replace('/','\\');
        paths.push({path:path});
    };
    res.render('clients/registerOrder',{superMarkets, productsSupermarket}); */
});

module.exports = router;