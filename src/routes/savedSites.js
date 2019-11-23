const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const client = require('../models/clients');
const supermarkets = require('../models/supermarkets');
const savedSites = require('../models/savedSites');
const dataUserConnected = require('../configuration/connectDB');
const googleClient = require('../configuration/googleClient');

router.get('/clients/possibleSitesToOrder', async (req,res) =>{
    const superMarkets = await supermarkets.find();
    res.render('clients/possibleSitesToOrder',{superMarkets});
});

router.post('/clients/possibleSitesToORder', async (req,res) =>{
    const {selectedsuperMarket,selectedTypes,selectedRadius} = req.body;
    if (selectedRadius<0){
        req.flash('error_msg','The radius must be a positive number!');
        res.redirect('/clients/possibleSitesToOrder');
    }
    var superMarketInfo = await supermarkets.findOne({idSuperMarket:selectedsuperMarket});
    var lat = superMarketInfo.latitude;
    var lng = superMarketInfo.longitude;
    var nearByResults = await googleClient.nearbyPlaces([lat,lng],selectedRadius,selectedTypes);
    res.render('clients/possibleSitesToOrder',{nearByResults});
});