const express = require('express');
const router = express.Router();
const clients = require('../models/clients');
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

module.exports = router;