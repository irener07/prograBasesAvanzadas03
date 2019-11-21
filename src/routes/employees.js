const express = require('express');
const router = express.Router();
const employees = require('../models/employees');
const clients = require('../models/clients');
const currentDate = Date.now;


router.get('/employees/moduleManagers/airlineFlights', async (req, res) => {
    const airlinesFound =  await airlines.find();
    const flightsFound = await flights.find();
    const airlineFlights = new Array();
    flightsFound.forEach( (flight) => {
        airlinesFound.forEach((airline) =>{
            if (flight.idAirline==airline.id){
                const totalAmount = flight.ticketsSold*flight.price;
                const newAirlineFlight = {
                    airlineName: airline.name,
                    flightName: flight.name,
                    origin: flight.origin,
                    destination: flight.destination,
                    date: flight.dateTime,
                    tickets: parseInt(flight.ticketsSold),
                    totalAmount
                };
                airlineFlights.push(newAirlineFlight);

            }
        });
    });
    res.render('employees/airlinesFlights',{airlineFlights});
});


// TERCERA CONSULTA
router.get('/employees/moduleManagers/mostVisitedDestinations', async (req, res) => {
    const flightsFound =  await flights.find();

    var foundDestinations = new Array("Afghanistan", "Albania", "Algeria", "American Samoa", "Angola", "Anguilla", "Antartica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Ashmore and Cartier Island", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Clipperton Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czeck Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Europa Island", "Falkland Islands (Islas Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern and Antarctic Lands", "Gabon", "Gambia, The", "Gaza Strip", "Georgia", "Germany", "Ghana", "Gibraltar", "Glorioso Islands", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City)", "Honduras", "Hong Kong", "Howland Island", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Ireland, Northern", "Israel", "Italy", "Jamaica", "Jan Mayen", "Japan", "Jarvis Island", "Jersey", "Johnston Atoll", "Jordan", "Juan de Nova Island", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Man, Isle of", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Midway Islands", "Moldova", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcaim Islands", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romainia", "Russia", "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Scotland", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and South Sandwich Islands", "Spain", "Spratly Islands", "Sri Lanka", "Sudan", "Suriname", "Svalbard", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Tobago", "Toga", "Tokelau", "Tonga", "Trinidad", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "USA", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands", "Wales", "Wallis and Futuna", "West Bank", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe");

    const foundResults = new Array();
  
    for(var counter = 0; 
        counter < foundDestinations.length; counter++) {
            var quantityTickets = 0;
        flightsFound.forEach( (flight) => {    
                if  (flight.destination==foundDestinations[counter]){
                    quantityTickets = quantityTickets + parseInt(flight.ticketsSold);   
                }
            
        });
        const newFoundResult = {
            destinationName: foundDestinations[counter],
            visitors: quantityTickets
        };
        foundResults.push(newFoundResult);
    }

    foundResults.sort(function (a, b) {
        if (a.visitors < b.visitors) {
          return 1;
        }
        if (a.visitors > b.visitors) {
          return -1;
        }
        return 0;
      });


    console.log(foundResults[6]);
    res.render('employees/mostVisitedDestinations',{foundResults});
        
});

//              MOSTRAR EMPLEADOS
router.get('/employees', async (req,res) => {
    const employeesFound = await employees.find();
    res.render('employees/all-employees', {employeesFound});
});

//              MODIFICAR EMPLEADOS
router.get('/employees/modify/:id', async (req, res) => {
    const employeeFound = await employees.findById(req.params.id);
    res.render('employees/editEmployees', {employeeFound});
});

router.put('/employees/modify-employee/:id', async (req,res) => {
    const {id, firstName, lastName, type, jobArea, email, password}= req.body;
    await employees.findByIdAndUpdate(req.params.id, {
        id, firstName, lastName, type, jobArea, email, password
    });
    res.redirect('/employees');
});

//              BORRAR EMPLEADOS
router.delete('/employees/delete/:id', async (req, res) => {
    await employees.findByIdAndDelete(req.params.id);
    res.redirect('/employees');
});

router.get('/employees/signUpEmployeees', (req, res) => {
    res.render('employees/signUpEmployeees');
});


router.get('/employees/signUpEmployees', (req, res) => {
    res.render('employees/signUpEmployees');
  });

router.get('/employees/moduleEmployees', (req, res) => {
    res.render('employees/moduleEmployees');
});

router.get('/employees/moduleManagers', (req, res) => {
    res.render('employees/moduleManagers');
});

router.post('/employees/signUpEmployees', async (req, res) => {
      const { id, firstName, lastName, type, jobArea, email, password }= req.body;
      const errors=[];
      console.log(req.body);

    if(type==-1){
        errors.push({text: 'Please, Select the type of worker'});
    }
    if(jobArea==-1){
        errors.push({text: 'Please, Select a department'});
    }
    if(id=='' || firstName=='' ||  lastName=='' ||  password=='' 
    ||  email==''){
        errors.push({text: 'Please, Insert the complete Data'});
    }
    if(errors.length>0){
        res.render('employees/signUpEmployees',{errors, id, firstName, lastName, type, 
            jobArea, email, password });   }
            
        else{
            const idE = await employees.findOne({id: id});
            const emailEmployee = await employees.findOne({email: email});
            if (emailEmployee || idE){
                req.flash('error_msg', 'The ID or Email is Already Registered');
                res.redirect('/employees/signUpEmployees');
            }

            const newEmployee = new employees( {id, firstName, lastName, type, currentDate, 
            jobArea, email, password } );
            newEmployee.password = await newEmployee.encryptPassword(password);
            await newEmployee.save();
            req.flash('success_msg', 'Successful Registration');
            res.redirect('/employees');
    
        } 
});

router.get('/employees/boarding', (req, res) => {
    res.render('employees/boardingEmployee');
});
    
router.post('/employees/boarding/search', async (req,res) => {
    const {clientId, flightId}= req.body;
    const errors=[];
    const purchase = await purchases.findOne({idClient: clientId, idFlight: flightId, status:'Checkin'});
    if(flightId=='' || clientId==''){
        errors.push({text: 'Please, Insert the Data Required'});
    }
    if(!purchase){
        errors.push({text: 'Please, Review the Data. There are no Purchases with these Parameters'});
    }
    if(errors.length>0){
        res.render('employees/boardingEmployee', {errors});
    }
    else{
        res.render('employees/boardingEmployee', {purchase});
    }
});
    
router.post('/employees/boardingEmployee/:_id&:idClient&:idFlight', async (req,res) => {
    const pur = await purchases.findById(req.params._id);
    await purchases.findByIdAndUpdate(req.params._id, { status:'Used'});
    req.flash('success_msg', 'Successful Check In. The Tickets Have Changed Status');
    res.redirect('/employees/boarding');
});

router.get('/employees/allDataClients', async (req, res) => {
    const allClients = await clients.find();
    res.render('employees/consultAllClients', {allClients});
});

router.get('/employees/dataClient', (req, res) => {
    res.render('employees/consultOneClient');
});
    
router.post('/employees/dataClient/search', async (req,res) => {
    const {clientId}= req.body;
    const errors=[];
    const client = await clients.findOne({id:clientId});
    if(clientId==''){
        errors.push({text: 'Please, Insert the Data Required'});
    }
    if(!client){
        errors.push({text: 'Please, Review the Data. There are no Clients with these Parameters'});
    }
    if(errors.length>0){
        res.render('employees/consultOneClient', {errors});
    }
    else{
        res.render('employees/consultOneClient', {client});
    }
});

router.get('/employees/verifyCheckIn', (req, res) => {
    res.render('employees/verifyCheckIn');
});
    
router.post('/employees/verifyCheckIn/search', async (req,res) => {
    const {clientId, flightId}= req.body;
    const errors=[];
    const purchase = await purchases.findOne({idClient: clientId, idFlight: flightId, status:'Checkin'});
    if(flightId=='' || clientId==''){
        errors.push({text: 'Please, Insert the Data Required'});
    }
    if(!purchase){
        errors.push({text: 'Please, Review the Data. There are no Purchases with these Parameters'});
    }
    if(errors.length>0){
        res.render('employees/verifyCheckIn', {errors});
    }
    else{
        req.flash('success_msg', 'The Tickets are in Check-In Status');
        res.redirect('/employees/verifyCheckIn');
    }
});
  
//                      Manager Reports
router.get('/employees/moduleManagers/airlineFlights', async (req, res) => {
    const airlinesFound =  await airlines.find();
    const flightsFound = await flights.find();
    const airlineFlights = new Array();
    flightsFound.forEach( (flight) => {
        airlinesFound.forEach((airline) =>{
            if (flight.idAirline==airline.id){
                const totalAmount = flight.ticketsSold*flight.price;
                const newAirlineFlight = {
                    airlineName: airline.name,
                    flightName: flight.name,
                    origin: flight.origin,
                    destination: flight.destination,
                    date: flight.dateTime,
                    tickets: parseInt(flight.ticketsSold),
                    totalAmount
                };
                airlineFlights.push(newAirlineFlight);

            }
        });
    });
    res.render('employees/airlinesFlights',{airlineFlights});
});

router.get('/employees/moduleManagers/passengersTicketsRange', async (req, res) => {
    const clientsFound = await clients.find();
    const purchasesFound = await purchases.find();
    const passengersTicketsRanges = new Array();
    clientsFound.forEach( (client) => {
        var min = 0;
        var max = 0;
        purchasesFound.forEach( (purchase) => {
            if (client.id==purchase.idClient){
                if (min==0 & max==0){
                    min=purchase.ticketsNumber;
                    max=purchase.ticketsNumber;
                }
                if (min>purchase.ticketsNumber){
                    min=purchase.ticketsNumber;
                }
                if (max<purchase.ticketsNumber){
                    max=purchase.ticketsNumber;
                }
            }
        });
        const passengersTicketRange = {
            id: client.id,
            name: client.firstName,
            lastName: client.lastName,
            range: [min,max]
        };
        passengersTicketsRanges.push(passengersTicketRange);
    });
    res.render('employees/passengersTicketsRange',{passengersTicketsRanges});
});


//                                  Employee's Reports
router.get('/employees/moduleEmployees/registeredFlights', (req, res) => {
    res.render('employees/registeredFlights');
});

router.post('/employees/moduleEmployees/registeredFlights', async (req,res) => {
    const {dateTimeBegin, dateTimeEnd, status, firstName, lastName} = req.body;
    const errors = [];
    if (dateTimeBegin=='' && dateTimeEnd=='' && status=='any' && firstName=='' && lastName==''){
        const flightsFound = await flights.find();
        res.render('employees/registeredFlights',{flightsFound});
        return;
    }
    else if ((dateTimeBegin=='' && dateTimeEnd!='') || (dateTimeBegin!='' && dateTimeEnd=='')){
        errors.push({text:"Please fulfill both dates for range"});
    }
    else if ((firstName!='' && lastName=='') || (firstName=='' && lastName!='') ){
        errors.push({text:"Please enter a full name"});
    }
    else if (status=='any' && firstName=='' && lastName==''){
        const flightsFound = await flights.find({dateTime:{$gte:dateTimeBegin,$lte:dateTimeEnd}});
        console.log(flightsFound);
        res.render('employees/registeredFlights',{flightsFound});
        return;
    }
    else if (dateTimeBegin.length==0 && dateTimeEnd.length==0 && firstName=='' && lastName =='' && status!='any'){
        const flightsFound = await flights.find({status:status});
        console.log(flightsFound);
        res.render('employees/registeredFlights',{flightsFound});
        return;
    }
    if (dateTimeBegin=='' && dateTimeEnd=='' && status=='any' && firstName!='' && lastName!=''){
        const clientFound = await clients.findOne({firstName:firstName,lastName:lastName});
        const purchaseFound = await purchases.find({idClient:clientFound.id});
        const flightsReg = await flights.find();
        const flightsFound = [];
        flightsReg.forEach( (flight) => {
            purchaseFound.forEach( (purchase) => {
                if (flight.id==purchase.idFlight){
                    flightsFound.push(flight);
                }
            });
        });
        res.render('employees/registeredFlights',{flightsFound});
    }
    
    if (dateTimeBegin!='' & dateTimeEnd!='' & status!='any' & firstName=='' & lastName==''){
        const flightsFound = await flights.find({dateTime:{$gte:dateTimeBegin,$lte:dateTimeEnd},status:status});
        res.render('employees/registeredFlights',{flightsFound}); 
        return;       
    }
    if (dateTimeBegin!='' & dateTimeEnd!='' & status=='any' & firstName!='' & lastName!=''){
        const clientFound = await clients.findOne({firstName:firstName,lastName:lastName});
        const purchaseFound = await purchases.find({idClient:clientFound.id});
        const flightsReg = await flights.find({dateTime:{$gte:dateTimeBegin,$lte:dateTimeEnd}});
        const flightsFound = [];
        flightsReg.forEach( (flight) => {
            purchaseFound.forEach( (purchase) => {
                if (flight.id==purchase.idFlight){
                    flightsFound.push(flight);
                }
            });
        });
        res.render('employees/registeredFlights',{flightsFound}); 
        return;
    }
    if (status!='any' & firstName!='' & lastName!='' & dateTimeBegin=='' & dateTimeEnd==''){
        const clientFound = await clients.findOne({firstName:firstName,lastName:lastName});
        const purchaseFound = await purchases.find({idClient:clientFound.id});
        const flightsReg = await flights.find({status:status});
        const flightsFound = [];
        flightsReg.forEach( (flight) => {
            purchaseFound.forEach( (purchase) => {
                if (flight.id==purchase.idFlight){
                    flightsFound.push(flight);
                }
            });
        });
        res.render('employees/registeredFlights',{flightsFound});  
        return;     
    }
    if (errors.length>0){
        res.render('employees/registeredFlights',{errors,dateTimeBegin, dateTimeEnd, status, firstName, lastName});
        return;
    }
});

module.exports = router;
