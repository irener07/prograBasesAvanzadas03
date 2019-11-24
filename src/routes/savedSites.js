const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const client = require('../models/clients');
const superMarket = require('../models/supermarkets');
const savedSites = require('../models/savedSites');
const dataUserConnected = require('../configuration/connectDB');

router.get('/clients/possibleSitesToOrder', (req,res) =>{
    res.render('clients/possibleSitesToOrder');
});