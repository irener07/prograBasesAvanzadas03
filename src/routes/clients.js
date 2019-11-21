const express = require('express');
const router = express.Router();
const clients = require('../models/clients');

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

router.get('/clients/moduleClients', async(req, res) => {
    const clientsFound = await clients.find();
    res.render('clients/moduleClients', {clientsFound});
});

router.get('/clients/modify/:id', async (req, res) => {
    const client = await clients.findById(req.params.id);
    res.render('clients/editClients', {client});
});

router.put('/clients/modify-client/:id', async (req,res) => {
    const {id, firstName, lastName, birthDate, nationality, country, state, address, email, telephone}= req.body;
    
    await clients.findByIdAndUpdate(req.params.id, {
        id, firstName, lastName, birthDate, nationality, country, state, address, email, telephone
    });
    res.redirect('/clients/moduleClients');
});

router.delete('/clients/delete/:id', async (req, res) => {
    await clients.findByIdAndDelete(req.params.id);
    res.redirect('/clients/moduleClients');
});


router.get('/clients/purchasesClients', (req, res) => {
    dataUserConnected.idFlight='';
    res.render('clients/purchasesClients');
});

router.post('/clients/purchasesClients', async (req, res) => {
    const {origin, destination, date01, date02}= req.body;
    const errors=[];
    if(origin==-1 || destination==-1 || origin==destination || date01>date02){
        errors.push({text: 'Please, Review the Data'});
    }
    if(errors.length>0){
        res.render('clients/purchasesClients',{errors, origin, destination, date01, date02});
    }
    else{
        const flightsFound = await flights.find({origin:origin, destination:destination, dateTime: {
            $gte: date01,
            $lt: date02
        }, $expr: { $gt: [ "$maximumCapacity", "$ticketsSold"]} });
        if (flightsFound.length<1){
            errors.push({text: 'Do not exist Flights this filters'});
            res.render('clients/purchasesClients',{errors, origin, destination, date01, date02});
            return;
        }
        else{
            res.render('clients/purchasesClients', {flightsFound});
        }
    }
});

router.get('/clients/mainModule', (req, res) => {
    res.render('clients/mainModule');
});

router.get('/clients/confirmPurchase/:idFlight', async (req, res) => {
    const flight = await flights.findById(req.params.idFlight);
    dataUserConnected.idFlight=flight.id;
    res.render('clients/confirmPurchase',{dataUserConnected});
});

router.post('/clients/confirmPurchase/:idFlight', async (req, res) => {
    const {ticketsNumber, suitcases, observation}= req.body;
    const errors=[];
    const idF = await flights.findOne({id: dataUserConnected.idFlight});
    const tS = parseInt(idF.ticketsSold);
    const mC = parseInt(idF.maximumCapacity);
    const tN=parseInt(ticketsNumber)+tS;
    if (tN>=mC){
        errors.push({text: 'The Number of Tickets is Greater than the Maximum Capacity of the Flight'});
    }
    if(ticketsNumber=='' || suitcases=='' || observation==''){
        errors.push({text: 'Please, Review the Data'});
    }
    if(errors.length>0){
        res.render('clients/confirmPurchase',{errors, ticketsNumber, suitcases, observation,dataUserConnected});
    }
    else{
        const idC = await purchases.findOne().sort({$natural:-1}).limit(1);
        const idClient = dataUserConnected.idUserConnected;
        const idFlight = dataUserConnected.idFlight;
        const status = 'Bought';
        const numSeats = [];
        if(!idC){
            const id = 1;
            const newPurchase = new purchases({id, idClient, idFlight, ticketsNumber, suitcases, observation, status, numSeats});
            await newPurchase.save();
            await flights.findOneAndUpdate({id:idFlight}, {ticketsSold:tN});
            req.flash('success_msg', 'Successful Purchase');
            res.redirect('/clients/purchasesClients');
        }
        else{
            const id = idC.id + 1;
            const newPurchase = new purchases({id, idClient, idFlight, ticketsNumber, suitcases, observation, status, numSeats});
            await newPurchase.save();
            await flights.findOneAndUpdate({id:idFlight}, {ticketsSold:tN});
            req.flash('success_msg', 'Successful Purchase');
            res.redirect('/clients/purchasesClients');
        }
    }
});

router.get('/clients/checkIn', (req, res) => {
    res.render('clients/checkIn');
});

router.post('/clients/checkIn-clients', async (req,res) => {
    const {clientId, flightId}= req.body;
    const errors=[];
    const purchase = await purchases.findOne({idClient: clientId, idFlight: flightId, status:'Bought'});
    if(flightId=='' || clientId==''){
        errors.push({text: 'Please, Insert the Data Required'});
    }
    if(!purchase){
        errors.push({text: 'Please, Review the Data. There are no Purchases with these Parameters'});
    }
    if(errors.length>0){
        res.render('clients/checkIn', {errors});
    }
    else{
        if (purchase.idClient!=dataUserConnected.idUserConnected){
            errors.push({text: 'The Purchase Corresponds to Another Customer'});
            res.render('clients/checkIn', {errors});
        }
        res.render('clients/checkIn', {purchase});
    }
});

router.post('/clients/checkInClients/:_id&:idClient&:idFlight', async (req,res) => {
    var numSeat = [];
    const idF = await flights.findOne({id:req.params.idFlight});
    const pur = await purchases.findById(req.params._id);
    var numS = parseInt(idF.seatNumber);
    var numT = parseInt(pur.ticketsNumber);
    var numNew = numS + numT;
    for (i=numS; i<numNew;i++){
        numSeat.push(i+1);
    }
    await flights.findOneAndUpdate({id:req.params.idFlight}, {seatNumber:numNew});
    await purchases.findByIdAndUpdate(req.params._id, { status:'Checkin', seatNumber:numSeat});
    req.flash('success_msg', 'Successful Check In. Your seat numbers are:'+numSeat);
    res.redirect('/clients/checkIn');
});



router.get('/clients/flightsReport', (req, res) => {
    res.render('clients/flightsReport');
});

router.post('/clients/flightsReport', async (req, res) => {
    const {status, date01, date02}= req.body;
    const idClient = dataUserConnected.idUserConnected;
    const errors=[];
    
    if(date01>date02){
        errors.push({text: 'Please, Review the Data'});
    }
    if(errors.length>0){
        res.render('clients/flightsReport',{errors, status, date01, date02});
    }
    if(status!="Select Status" && date01.length==0 && date02.length==0 ){
        const purchasesFound = await purchases.find({idClient:idClient});
        const flightsFound = await flights.find({status:status})
        const flightsRequests = new Array();
        purchasesFound.forEach( (purchase) =>{
            flightsFound.forEach( (flight) =>{
                if (purchase.idFlight == flight.id){
                    const newFlight = {
                        idAirline: flight.idAirline,
                        name: flight.name,
                        origin: flight.origin,
                        destination: flight.destination,
                        itinerary: flight.itinerary,
                        dateTime: flight.dateTime,
                        restrictions: flight.restrictions,
                        services: flight.services,
                        status: flight.status,
                        price: flight.price
                    };
                    flightsRequests.push(newFlight);
                
                }
            });
        });
        res.render('clients/flightsReport', {flightsRequests});
        return;

    }
    if(status=="Select Status" && date01.length>0 && date02.length>0 ){
        const purchasesFound = await purchases.find({idClient:idClient});
        const flightsFound = await flights.find({dateTime: {$gte: date01,$lt: date02}});
        const flightsRequests = new Array();
        purchasesFound.forEach( (purchase) =>{
            flightsFound.forEach( (flight) =>{
                if (purchase.idFlight == flight.id){
                    const newFlight = {
                        idAirline: flight.idAirline,
                        name: flight.name,
                        origin: flight.origin,
                        destination: flight.destination,
                        itinerary: flight.itinerary,
                        dateTime: flight.dateTime,
                        restrictions: flight.restrictions,
                        services: flight.services,
                        status: flight.status,
                        price: flight.price
                    };
                    flightsRequests.push(newFlight);
                
                }
            });
        });
        res.render('clients/flightsReport', {flightsRequests});
        return;
        
    }
    else{
        const purchasesFound = await purchases.find({idClient:idClient});
        const flightsFound = await flights.find({status:status, dateTime: {$gte: date01,$lt: date02}});       
        const flightsRequests = new Array();
        purchasesFound.forEach( (purchase) =>{
            flightsFound.forEach( (flight) =>{
                if (purchase.idFlight == flight.id){
                    const newFlight = {
                        idAirline: flight.idAirline,
                        name: flight.name,
                        origin: flight.origin,
                        destination: flight.destination,
                        itinerary: flight.itinerary,
                        dateTime: flight.dateTime,
                        restrictions: flight.restrictions,
                        services: flight.services,
                        status: flight.status,
                        price: flight.price
                    };
                    flightsRequests.push(newFlight);
                
                }
            });
        });
        
        res.render('clients/flightsReport',{flightsRequests});
        return;
       
       
    }
    
});


module.exports = router;