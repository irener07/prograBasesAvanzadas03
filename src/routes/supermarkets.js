const express = require('express');
const router = express.Router();
const supermarkets = require('../models/supermarkets');



router.get('/supermarkets/createSupermarket', (req, res) => {
    res.render('supermarkets/createSupermarket');
});



router.post('/supermarkets/createSupermarket', async (req, res) => {
    const {idSuperMarket, name, description, address, longitude, latitude, image, telephone, rating, schedule, website, products}= req.body;
    const errors=[];

    if(idSuperMarket=='' || name=='' || description=='' || address=='' || longitude=='' || latitude==''|| telephone=='' || rating==''|| schedule==''|| website==''){
        errors.push({text: 'Please, Insert the Data'});
    }
    if(errors.length>0){
        res.render('supermarkets/createSupermarket',{idSuperMarket, name, description, address, longitude, latitude, image, telephone, rating, schedule, website, products});
    }
    else{
        const idC = await supermarkets.findOne({id: id});
        if (idC){
            req.flash('error_msg', 'The ID is Already Registered');
            res.redirect('/supermarkets/createSupermarket');
        }
        const newSupermarket = new supermarkets({idSuperMarket, name, description, address, longitude, latitude, image, telephone, rating, schedule, website, products});
        await newSupermarket.save();
        req.flash('success_msg', 'Successful Registration');
        res.redirect('/supermarkets');
    }
});

router.get('/supermarkets', async (req, res) => {
    const supermarketsFound = await supermarkets.find();
    res.render('supermarkets/supermarketsModule', {supermarketsFound});
});

module.exports = router;