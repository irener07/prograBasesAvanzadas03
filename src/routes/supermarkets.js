const express = require('express');
const router = express.Router();
const supermarkets = require('../models/supermarkets');
const googleClient = require('../configuration/googleClient');


//googleClient.searchPlaceByAddress("Walmart Paraiso");
//googleClient.autocompleteQuery("Walmart");

//
//var result = googleClient.searchPlaceByAddress("Walmart Paraiso");
//googleClient.autocompleteQuery("Walmart");
//result.then((res)=>{
// console.log(res);
//});
//googleClient.placeDetailsByCoordinates([9.8497821,-83.9489179]);

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
                res.render('supermarkets/createSupermarket',{supermarketsFound});
            });
        }
        if(latitude=='' && longitude=='' && address!=''){
            var result = googleClient.searchPlaceByAddress("Walmart Paraiso");
            result.then((supermarketsFound)=>{
                res.render('supermarkets/createSupermarket',{supermarketsFound});
            });
        }
    }
});

router.get('/supermarkets', async (req, res) => {
    const supermarketsFound = await supermarkets.find();
    res.render('supermarkets/supermarketsModule', {supermarketsFound});
});

router.get('/supermarkets/registerSupermarket/:id', async (req, res) => {
    var result = googleClient.placeDetailsById(req.params.id);
    result.then((supermarketsFound)=>{
        res.render('supermarkets/registerSupermarket',{supermarketsFound});
    });
});

router.get('/supermarkets/addProducts', async (req, res) => {
    const employeeFound = req.body;
    res.render('supermarkets/addProducts', {employeeFound});
});

module.exports = router;