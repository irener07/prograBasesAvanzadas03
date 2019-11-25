const express = require('express');
const supermarkets = require('../models/supermarkets');
const fs = require('fs');
const products = require('../models/products');
const googleClient = require('../configuration/googleClient');
const router = express.Router();


router.get('/supermarkets/createSupermarket', (req, res) => {
    res.render('supermarkets/createSupermarket');
});

router.post('/supermarkets/createSupermarket', async (req, res) => {
    const {latitude, longitude, address}= req.body;
    const errors=[];

    if(latitude=='' && longitude=='' && address==''){
        errors.push({text: 'Please, Insert the Data'});
    }
    if(latitude!='' && longitude=='' && address==''){
        errors.push({text: 'Please, Insert the Data'});
    }
    if(latitude=='' && longitude!='' && address==''){
        errors.push({text: 'Please, Insert the Data'});
    }
    if(errors.length>0){
        res.render('supermarkets/createSupermarket',{latitude, longitude, address, errors});
    }
    else{
        if(latitude!='' && longitude!='' && address==''){
            var result = googleClient.placeDetailsByCoordinates([latitude,longitude]);
            result.then((supermarketsFound)=>{
                res.render('supermarkets/createSupermarket',{latitude, longitude, address,supermarketsFound});
            });
        }
        if(latitude=='' && longitude=='' && address!=''){
            var result = googleClient.searchPlaceByAddress(address);
            result.then((supermarketsFound)=>{
                res.render('supermarkets/createSupermarket',{latitude, longitude, address,supermarketsFound});
            });
        }
    }
});

router.get('/supermarkets', async (req, res) => {
    const supermarketsFound = await supermarkets.find();
    res.render('supermarkets/supermarketsModule', {supermarketsFound});
});

router.get('/supermarkets/registerSupermarket/:id', async (req, res) => {
    var result = googleClient.placeDetailsID(req.params.id);
    result.then((supermarketsFound)=>{
        res.render('supermarkets/registerSupermarket',{supermarketsFound});
    });
});

router.post('/supermarkets/registerSupermarket/:id', async (req, res) => {
    const {idSuperMarket, name, description,address,latitude,longitude,typeSupermarket,image,
            telephone, rating, schedule, website}= req.body;
    const errors=[];
    if(description==''){
        errors.push({text: 'Please, Insert the Description'});
    }
    if(errors.length>0){
        res.render('supermarkets/registerSupermarket',{errors, idSuperMarket, name, description,address,latitude,longitude,typeSupermarket,image,
            telephone, rating, schedule, website});
    }
    else{
        const idS = await supermarkets.findOne({idSuperMarket: idSuperMarket});
        if (idS){
            req.flash('error_msg', 'The Supermarket is Already Registered');
            res.redirect('/supermarkets');
        }
        const newSupermarket = new supermarkets({idSuperMarket, name, description,address,latitude,
            longitude,typeSupermarket,image,telephone, rating, schedule, website});
        await newSupermarket.save();
        req.flash('success_msg', 'Successful Registration');
        res.redirect('/supermarkets');
    } 
});

router.get('/supermarkets/registerProducts/:id', async (req, res) => {
    const idM=req.params.id;
    res.render('supermarkets/addProducts',{idM});
});

router.post('/supermarkets/registerProducts/:id', async (req, res) => {
    const {idProduct, name, description,price,imageProduct}= req.body;
    const idM=req.params.id;
    const errors=[];
    var path = 'C:/uploads';
    path = path +"/"+ imageProduct;
    console.log(path);
    if(description=='' || imageProduct == '' ||  idProduct=='' || name=='' || price==''){
        errors.push({text: 'Please, Insert the Data'});
    }
    if(errors.length>0){
        res.render('supermarkets/addProducts',{errors, idM, idProduct, name, description,price});
    }
    else{
        const newProduct = new products({idProduct, name, description, price});
        newProduct.img.data = fs.readFileSync(path)
        newProduct.img.contentType = 'image/png';

        await supermarkets.findOneAndUpdate({idSuperMarket: idM}, {$push:{products: newProduct}});
        req.flash('success_msg', 'Successful Registration');
        res.redirect('/supermarkets');
    } 
});



module.exports = router;