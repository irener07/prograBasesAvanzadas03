const express = require('express');
const router = express.Router();
const clients = require('../models/clients');
const fs = require('fs');
const orders = require('../models/orders');
const supermarkets = require('../models/supermarkets');
const products = require('../models/products');
const dataUserConnected = require('../configuration/connectDB');
const currentDate = Date.now;

//this route allows to display the signUpClients view
//Input: view's route
//Output: the view
//Restrictions: the view hbs needs to be already created
router.get('/clients/signUpClients', (req, res) => {
    res.render('clients/signUpClients');
});
//this route allows to get the data from the sign up form and create a new client in the database
//Input: id, firstName, lastName, birthDate, email, password, telephone
//Output: a new client in the database
//Restrictions: connection to the database
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
//this route allows to display the clientsModule view
//Input: view's route
//Output: the view
//Restrictions: the view hbs needs to be already created

router.get('/clients/clientsModule', (req, res) => {
    res.render('clients/clientsModule');
});
//this route allows to display the registerOrder view
//Input: view's route
//Output: the view
//Restrictions: the view hbs needs to be already created

router.get('/clients/registerOrder', async (req, res) => {
    const superMarkets = await supermarkets.find();
    res.render('clients/registerOrder',{superMarkets});
});

router.post('/clients/registerOrder', async (req, res) => {
    const {superMarket}= req.body;
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
    dataUserConnected.idSupermarket=superMarket;
    res.render('clients/registerOrder',{superMarkets, productsSupermarket});
});

router.post('/clients/registerOrder/confirmed/:id', async (req, res) => {
    const idProduct = req.params.id;
    dataUserConnected.idProduct=idProduct;
    res.render('clients/registerProductOrder',{idProduct});
});

router.post('/clients/registerProductOrder', async (req, res) => {
    const {status,quantity,particularNeeds} = req.body;
    const errors=[];
    if(quantity==''){
        errors.push({text: 'Please, Insert the Data'});
    }
    if(errors.length>0){
        res.render('/clients/registerOrder/confirmed',{errors, idProduct,status,quantity,particularNeeds});
    }
    else{
        const idProduct=dataUserConnected.idProduct;
        const idClient = dataUserConnected.idUserConnected;
        const idSuperMarket = dataUserConnected.idSupermarket;
        const newProduct = {idProduct, quantity};
        const superM = await supermarkets.findOne({idSuperMarket:idSuperMarket});
        var priceP;
        for(i=0; i<superM.products.length;i++){
            if(superM.products[i].idProduct==idProduct){
                priceP=superM.products[i].price;
                break;
            }
        };
        var newPrice;
        const idC = await orders.findOne().sort({$natural:-1}).limit(1);
        var id = 0;
        if (!idC){
            id = 1;   
        }
        else{   
            id = idC.id + 1;
        }
        var products =[]
        newPrice = quantity*parseInt(priceP);
        var totalAmount=newPrice;
        const newOrder = new orders({id,products,status,particularNeeds,idClient,idSuperMarket,totalAmount});
        newOrder.products.push(newProduct);
        await newOrder.save();
        dataUserConnected.idProduct='';
        dataUserConnected.idSupermarket='';
        req.flash('success_msg', 'Successful Registration');
        res.redirect('/clients/registerOrder');
    }
});


router.get('/clients/clientsRecord', async (req, res) => {
    const clientId = dataUserConnected.idUserConnected;
    const errors=[];
    const order = await orders.findOne({idClient:clientId});
    if(!order){
        errors.push({text: 'Please, review the data. There are no orders with these ID'});
    }
    if(errors.length>0){
        res.render('clients/clientsRecord',{errors, clientId});
    }
    else{
        const totalPurchasesR = await orders.find({idClient:clientId});
        const totalPurchases = totalPurchasesR.length;
        const ordersFound = await orders.find({idClient:clientId});
        
        const ordersRequests = new Array();
        ordersFound.forEach( (order) =>{
            const newOrder = {
                id: order.id,
                dateTime: order.dateTime,
                particularNeeds: order.particularNeeds,
                totalAmount: order.totalAmount
            }
            ordersRequests.push(newOrder);
            
        });
        res.render('clients/clientsRecord', {totalPurchases, ordersRequests});
        

    }
    
});

/* router.post('/clients/clientsRecord', async (req, res) => {
    const clientId = dataUserConnected.idUserConnected;
    const errors=[];
    const order = await orders.findOne({idClient:clientId});
    if(clientId==''){
        errors.push({text: 'Please, Insert the Data Required'});
    }
    if(!order){
        errors.push({text: 'Please, review the data. There are no orders with these ID'});
    }
    if(errors.length>0){
        res.render('clients/clientsRecord',{errors, clientId});
    }
    else{
        const totalPurchasesR = await orders.find({idClient:clientId});
        const totalPurchases = totalPurchasesR.length;
        const ordersFound = await orders.find({idClient:clientId});
        
        const ordersRequests = new Array();
        ordersFound.forEach( (order) =>{
            const newOrder = {
                id: order.id,
                dateTime: order.dateTime,
                particularNeeds: order.particularNeeds,
                totalAmount: order.totalAmount
            }
            ordersRequests.push(newOrder);
            
        });
        res.render('clients/clientsRecord', {totalPurchases, ordersRequests});
        return;

    }
    
}); */


module.exports = router;