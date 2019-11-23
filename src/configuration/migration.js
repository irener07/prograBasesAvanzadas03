var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('TECMarket', 'Abcd1234'));
var session = driver.session();

const clients = require('../models/clients');
const supermarkets = require('../models/supermarkets');
const orders = require('../models/orders');

module.exports = async()=>{
    session
        .run('MATCH (n)DETACH DELETE n')
        .then(function(result){
            session.close();                
        })
        .catch(function(err){
            console.log(err);
        })

    const mongoClients = await clients.find();

    for(var i = 0; i < mongoClients.length; i++){
        const client = mongoClients[i];
        //console.log(client);
        const id = client.id.toString();
        const firstName = client.firstName;
        const lastName = client.lastName;
        const birthDate = client.birthDate;
        const email = client.email;
        const password =  client.password;
        const telephone = client.telephone;

        session
        .run('CREATE (n:clients {id:{idParam},firstName:{firstNameParam},lastName:{lastNameParam},birthDate:{birthDateParam},email:{emailParam},password:{passwordParam},telephone:{telephoneParam}}) Return n',
         {idParam:id,firstNameParam:firstName,lastNameParam:lastName,birthDateParam:birthDate,emailParam:email,passwordParam:password,telephoneParam:telephone})
        .then(function(result){
            session.close();                
        })
        .catch(function(err){
            console.log(err);
        })
    };

    const mongoOrders = await orders.find();

    for(var i = 0; i < mongoOrders.length; i++){
        const order = mongoOrders[i];
        //console.log(delivery);

        const id = order.id.toString();
        //console.log(idDelivery);
        const products = order.products.toString();
        const dateTime = order.dateTime.toString();
        //console.log(date);
        const status = order.status;
        const particularNeeds = order.particularNeeds;
        const idClient = order.idClient;
        const idSuperMarket = order.idSuperMarket;
        const totalAmount = order.totalAmount;

        session
        .run('CREATE (n:orders {id:{idParam},products:{productsParam},dateTime:{dateTimeParam},status:{statusParam},particularNeeds:{needsParam},idClient:{idClientParam},idSuperMarket:{idSuperMarketParam},totalAmount:{totalAmountParam}}) Return n',
         {idParam:id,productsParam:products,dateTimeParam:dateTime,statusParam:status,needsParam:particularNeeds,idClientParam:idClient,idSuperMarketParam:idSuperMarket,totalAmountParam:totalAmount})
        .then(function(result){
            session.close();                
        })
        .catch(function(err){
            console.log(err);
        })
    };

    const mongoSupermarkets = await supermarkets.find();

    for(var i = 0; i < mongoSupermarkets.length; i++){
        const supermarket = mongoSupermarkets[i];
        //console.log(place);
        const idSuperMarket = supermarket.idSuperMarket;
        const name = supermarket.name;
        const description = supermarket.description;
        const address = supermarket.address;
        const latitude = supermarket.latitude;
        const longitude = supermarket.longitude;
        const typeSuperMarket = supermarket.typeSuperMarket;
        const image = supermarket.image;
        const telephone = supermarket.telephone;
        const rating = supermarket.rating;
        const schedule = supermarket.schedule;
        const website = supermarket.website;
        const products = supermarket.products;

        session
        .run('CREATE (n:supermarkets{idSuperMarket:{idSuperMarketParam},name:{nameParam},description:{descriptionParam},address:{addressParam},latitude:{latitudeParam},longitude:{longitudeParam},typeSuperMarket:{typeSuperMarketParam},image:{imageParam},telephone:{telephoneParam},rating:{ratingParam},schedule:{scheduleParam},website:{websiteParam},products:{productsParam}}) Return n',
         {idSuperMarketParam:idSuperMarket,nameParam:name,descriptionParam:description,addressParam:address,latitudeParam:latitude,longitudeParam:longitude,typeSuperMarketParam:typeSuperMarket,imageParam:image,telephoneParam:telephone,ratingParam:rating,scheduleParam:schedule,websiteParam:website,productsParam:products})
        .then(function(result){
            session.close();                
        })
        .catch(function(err){
            console.log(err);
        })
    };


    for(var i = 0; i < adminMongoClients.length; i++){
        //console.log(adminMongoClients);
        const client = adminMongoClients[i];
        //console.log(client);
        const idUser = client.idUser.toString();
        console.log("Pto1: idUser");
        console.log(idUser);
        const email = client.email;
        //console.log("Pto1: email");
        //console.log(email);

        for(var j = 0; j < adminMongoDeliveries.length; j++){
            const delivery = adminMongoDeliveries[j];
            //console.log(delivery);
            const idDelivery = delivery._id.toString();
            //console.log("Pto2: idDelivery");
            //console.log(idDelivery);
            const idClientDelivery = delivery.idClient;
            //console.log("Pto2: idClientDelivery");
            //console.log(idClientDelivery);

            if(idClientDelivery==email){
                //console.log("Pto3: It is inside");
                //console.log("Pto3: "+idDelivery);
                //console.log("Pto3: "+idUser);
                session
                    .run('MATCH (a:Clients {idUser:{idUserParam}}),(b:Deliveries {idDelivery:{idDeliveryParam}}) MERGE(a)-[r:ORDER]-(b) RETURN a,b', {idDeliveryParam:idDelivery, idUserParam:idUser})
                    .then(function(result){
                        //console.log(idUser);
                        //console.log(idDelivery);
                        session.close();                
                    })
                    .catch(function(err){
                        console.log(err);
                    })
                //console.log("Pto3: R made");
            };
        };
    };

    for(var i = 0; i < adminMongoDeliveries.length; i++){
        const delivery = adminMongoDeliveries[i];
        //console.log(delivery);

        const idDelivery = delivery._id.toString();
        //console.log("Pto1: idDelivery");
        //console.log(idDelivery);
        const idPlaceDelivery = delivery.idPlace;
        //console.log("Pto1: idPlaceDelivery");
        //console.log(idPlaceDelivery);

        for(var j = 0; j < adminMongoPlaces.length; j++){
            const place = adminMongoPlaces[j];
            //console.log(place);
            const idPlace = place.idPlace;
            //console.log("Pto2: idPlaceDelivery");
            //console.log(idPlaceDelivery);
            //console.log("Pto2: idPlace");
            //console.log(idPlace);
            if (idPlaceDelivery == idPlace){
                //console.log("Pto3: It is inside");
                session
                    .run('MATCH (a:Deliveries {idDelivery:{idDeliveryParam}}),(b:Places{idPlace:{idPlaceParam}}) MERGE(a)-[r:LEAVES_FROM]-(b) RETURN a,b', {idPlaceParam:idPlace, idDeliveryParam:idDelivery})
                    .then(function(result){
                        session.close();                
                    })
                    .catch(function(err){
                        console.log(err);
                    })
                //console.log("Pto3: R made");
            };

        };

    };

}