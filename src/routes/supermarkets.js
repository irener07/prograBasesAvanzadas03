const express = require('express');
const router = express.Router();
const supermarkets = require('../models/supermarkets');
const googleClient = require('../configuration/googleClient');


//googleClient.searchPlaceByAddress("Walmart Paraiso");
//googleClient.autocompleteQuery("Walmart");



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
            const supermarketsFound = await googleClient.placeDetailsByCoordinates([latitude,longitude]);
            res.render('supermarkets/createSupermarket',{supermarketsFound});
            console.log(supermarketsFound);
        }
        if(latitude=='' && longitude=='' && address!=''){
            var supermarketsFound = await googleClient.searchPlaceByAddress(address);
            res.render('supermarkets/createSupermarket',{supermarketsFound});
        }
    }
});

router.get('/supermarkets', async (req, res) => {
    const supermarketsFound = await supermarkets.find();
    res.render('supermarkets/supermarketsModule', {supermarketsFound});
});

router.get('/supermarkets/registerSupermarket/', async (req, res) => {
    const employeeFound = req.body;
    res.render('supermarkets/registerSupermarket', {employeeFound});
});

router.get('/supermarkets/addProducts', async (req, res) => {
    const employeeFound = req.body;
    res.render('supermarkets/addProducts', {employeeFound});
});

module.exports = router;