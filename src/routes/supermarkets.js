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
        res.render('supermarkets/createSupermarket',{latitude, longitude, address});
    }
    else{
        if(latitude!='' && longitude!='' && address==''){
            const supermarketsFound = googleClient.placeDetailsByCoordinates([latitude,longitude]);
            res.render('supermarkets/createSupermarket',{supermarketsFound});
        }
        if(latitude=='' && longitude=='' && address!=''){
            const supermarketsFound = googleClient.searchPlaceByAddress(address);
            res.render('supermarkets/createSupermarket',{supermarketsFound});
        }
    }
});

router.get('/supermarkets', async (req, res) => {
    const supermarketsFound = await supermarkets.find();
    res.render('supermarkets/supermarketsModule', {supermarketsFound});
});

router.get('/supermarkets/registerSupermarket/:id', async (req, res) => {
    const employeeFound = req.body;
    res.render('employees/editEmployees', {employeeFound});
});

module.exports = router;