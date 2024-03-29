const express = require('express');
const router = express.Router();
const supermarkets = require('../models/supermarkets');
const savedSites = require('../models/savedSites');
const dataUserConnected = require('../configuration/connectDB');
const googleClient = require('../configuration/googleClient');
var superMarketId="";

router.get('/clients/possibleSitesToOrderModule', async (req,res) =>{
    var listSites = await savedSites.find({idClient:dataUserConnected.idUserConnected});
    const listSupermarkets = await supermarkets.find();
    for (i=0; i<listSites.length;i++){
        for (j=0; j<listSupermarkets.length;j++){
            var n = listSites[i].idSuperMarket.localeCompare(listSupermarkets[j].idSuperMarket);
            if(n==0){
                listSites[i].supermarketName =listSupermarkets[j].name;
            }
        }
    };

    res.render('clients/possibleSitesToOrderModule',{listSites});
});

router.get('/clients/possibleSitesToOrder/search', async (req,res) =>{
    const superMarkets = await supermarkets.find();
    res.render('clients/possibleSitesToOrder',{superMarkets});
});

router.post('/clients/possibleSitesToORder', async (req,res) =>{
    const {selectedSuperMarket,selectedTypes,selectedRadius} = req.body;
    superMarketId = selectedSuperMarket;
    if (selectedRadius<0){
        req.flash('error_msg','The radius must be a positive number!');
        res.redirect('/clients/possibleSitesToOrder/search');
    }
    var superMarketInfo = await supermarkets.findOne({idSuperMarket: selectedSuperMarket});
    var lat = superMarketInfo.latitude;
    var lng = superMarketInfo.longitude;
    var numberRadius = parseInt(selectedRadius);
    var nearByResults = await googleClient.nearbyPlaces([lat,lng],numberRadius,selectedTypes);
    const superMarkets = await supermarkets.find();
    res.render('clients/possibleSitesToOrder',{nearByResults,superMarkets});
});

router.post('/clients/possibleSitesToOrder/registerSite/:id',async (req,res) =>{
    var superMarketInfo = await googleClient.placeDetailsID(superMarketId);
    var newSiteDetails = await googleClient.placeDetailsID(req.params.id);
    var newSite = {};
    newSite.placeid = newSiteDetails.placeid;
    newSite.name = newSiteDetails.name;
    newSite.international_phone_number = newSiteDetails.international_phone_number;
    newSite.rating = newSiteDetails.rating;
    newSite.weekday_text = newSiteDetails.weekday_text;
    newSite.website = newSiteDetails.website;
    newSite.PhotoUrl = newSiteDetails.PhotoUrl;
    var newSiteDistance = await googleClient.distanceBetween(
        [[superMarketInfo.lat,superMarketInfo.lng]],
        [[newSiteDetails.lat,newSiteDetails.lng]]
        );
    newSite.distance = newSiteDistance;
    var savedSitesClient = await savedSites.findOne({
        idClient: dataUserConnected.idUserConnected,
        idSuperMarket: superMarketId
    });
    if(savedSitesClient){
        await savedSites.findOneAndUpdate(
            {
                idClient: parseInt(dataUserConnected.idUserConnected),
                idSuperMarket: superMarketId
            },
            {
                $push:{sites: newSite}
            }
        );
        req.flash('success_msg', 'Successful Registration');
        res.redirect('/clients/possibleSitesToOrderModule');
    }
    else{
        sites = [];
        sites.push(newSite);
        idClient = parseInt(dataUserConnected.idUserConnected);
        idSuperMarket = superMarketId;
        var savedSitesClient = new savedSites({
            idClient,idSuperMarket,sites
        });
        await savedSitesClient.save();
        req.flash('success_msg', 'Successful Registration');
        res.redirect('/clients/possibleSitesToOrderModule');

    }
    
});


module.exports = router;