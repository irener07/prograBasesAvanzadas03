const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'Abcd1234'));
const session = driver.session();

const clients = require('../models/clients');
const supermarkets = require('../models/supermarkets');
const orders = require('../models/orders');


module.exports = async()=>{


    // Insert markets
    session
        .run('MATCH (n)DETACH DELETE n')
        .then(function(result){
            session.close();                
        })
        .catch(function(err){
            console.log(err);
        })

    const mongoSupermarkets = await supermarkets.find();
    for(var i = 0; i < mongoSupermarkets.length; i++){
        var supermarket = mongoSupermarkets[i];
        var idSuperMarket = supermarket.idSuperMarket;
        var name = supermarket.name;
        var description = supermarket.description;
        var address = supermarket.address;
        var latitude = supermarket.latitude.toString();
        var longitude = supermarket.longitude.toString();
        var typeSuperMarket = supermarket.typeSupermarket.toString();
        var telephone = supermarket.telephone;
        var rating = supermarket.rating;
        var schedule = supermarket.schedule.toString();
        var website = supermarket.website;

        const resultPromise = session
        .run('CREATE (n:supermarkets{idSuperMarket:{idSuperMarketParam},name:{nameParam},description:{descriptionParam},address:{addressParam},latitude:{latitudeParam},longitude:{longitudeParam},typeSuperMarket:{typeSuperMarketParam},telephone:{telephoneParam},rating:{ratingParam},schedule:{scheduleParam},website:{websiteParam}}) Return n',
         {idSuperMarketParam:idSuperMarket,nameParam:name,descriptionParam:description,addressParam:address,latitudeParam:latitude,longitudeParam:longitude,typeSuperMarketParam:typeSuperMarket,telephoneParam:telephone,ratingParam:rating,scheduleParam:schedule,websiteParam:website})
         resultPromise.then(result => {
            session.close();
          
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
          
          });


        var products = supermarket.products;

        for(var k = 0; k < products.length; k++){
            const product = products[k];
        
            const idP = product.idProduct.toString();
            const nameP = product.name;
            const descriptionP = product.description;
            //const imageP = product.img;
            const priceP = product.price;
      
            const resultPromise = session
            .run('CREATE (n:products {idProduct:{idParam},name:{nameParam},description:{descriptionParam},price:{priceParam}}) Return n',
             {idParam:idP,nameParam:nameP,descriptionParam:descriptionP,priceParam:priceP})
             resultPromise.then(result => {
                session.close();
              
                const singleRecord = result.records[0];
                const node = singleRecord.get(0);
              
              });
        };
    };

    //Insert clients 
    const mongoClients = await clients.find();
    for(var i = 0; i < mongoClients.length; i++){
        const client = mongoClients[i];
    
        const id = client.id;
        const firstName = client.firstName;
        const lastName = client.lastName;
        const birthDate = client.birthDate.toString();
        const email = client.email;
        const password =  client.password;
        const telephone = client.telephone;

        const resultPromise = session
        .run('CREATE (n:clients {id:{idParam},firstName:{firstNameParam},lastName:{lastNameParam},birthDate:{birthDateParam},email:{emailParam},password:{passwordParam},telephone:{telephoneParam}}) Return n',
         {idParam:id,firstNameParam:firstName,lastNameParam:lastName,birthDateParam:birthDate,emailParam:email,passwordParam:password,telephoneParam:telephone})
        
         resultPromise.then(result => {
            session.close();
          
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
          
          });
    };


    //Insert orders
    const mongoOrders = await orders.find();

    for(var i = 0; i < mongoOrders.length; i++){
        const order = mongoOrders[i];
        const idOrden = order.id;
        const dateTime = order.dateTime.toString();
        const status = order.status;
        const particularNeeds = order.particularNeeds;
        const idClient = order.idClient;
        const idSuperMarket = order.idSuperMarket;
        const totalAmount = order.totalAmount.toString();
        const idProduct = order.products[0].idProduct;

        var resultPromise = session
        .run('CREATE (n:orders {idOrden:{idParam},dateTime:{dateTimeParam},status:{statusParam},particularNeeds:{particularNeedsParam},idClient:{idClientParam},idSuperMarket:{idSuperMarketParam},totalAmount:{totalAmountParam}, idProduct:{idProductParam}}) Return n',
         {idParam:idOrden, dateTimeParam:dateTime, statusParam:status, particularNeedsParam:particularNeeds,idClientParam:idClient,idSuperMarketParam:idSuperMarket, totalAmountParam:totalAmount, idProductParam: idProduct})
         resultPromise.then(result => {
            session.close();
          
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
          
          });
            

    };

   // Connection betwwen orders and clients
    for(var i = 0; i < mongoClients.length; i++){
        const client = mongoClients[i];
        const idCl = client.id;
        
        for(var j = 0; j < mongoOrders.length; j++){
            const order = mongoOrders[j];
            const idOrder = order.idClient;
            if(idOrder==idCl){
                session
                    .run('MATCH (a:clients {id:{idParamC}}),(b:orders {idClient:{idParamO}}) MERGE(a)-[r:orderClient]-(b) RETURN a,b', {idParamC:idCl, idParamO:idOrder})
                    .then(function(result){
                        session.close();                
                    })
                    .catch(function(err){
                        console.log(err);
                    })
            };
        };
    };

   // Connection betwwen orders and supermarkets
   for(var i = 0; i < mongoSupermarkets.length; i++){
    const superM = mongoSupermarkets[i];
    const idCl = superM.idSuperMarket;
    
    for(var j = 0; j < mongoOrders.length; j++){
        const order = mongoOrders[j];
        const idOrder = order.idSuperMarket;
        if(idOrder==idCl){
            session
                .run('MATCH (a:supermarkets {idSuperMarket:{idParamC}}),(b:orders {idSuperMarket:{idParamO}}) MERGE(a)-[r:orderSupermarket]-(b) RETURN a,b', {idParamC:idCl, idParamO:idOrder})
                .then(function(result){
                    session.close();                
                })
                .catch(function(err){
                    console.log(err);
                })
        };
    };
};


}
