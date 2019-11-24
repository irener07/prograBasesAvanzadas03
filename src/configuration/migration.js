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
        const supermarket = mongoSupermarkets[i];
        const idSuperMarket = supermarket.idSuperMarket;
        const name = supermarket.name;
        const description = supermarket.description;
        const address = supermarket.address;
        const latitude = supermarket.latitude.toString();
        const longitude = supermarket.longitude.toString();
        const typeSuperMarket = supermarket.typeSupermarket;
        const telephone = supermarket.telephone;
        const rating = supermarket.rating;
        const schedule = supermarket.schedule;
        const website = supermarket.website;

         session
        .run('CREATE (n:supermarkets{idSuperMarket:{idSuperMarketParam},name:{nameParam},description:{descriptionParam},address:{addressParam},latitude:{latitudeParam},longitude:{longitudeParam},typeSuperMarket:{typeSuperMarketParam},telephone:{telephoneParam},rating:{ratingParam},schedule:{scheduleParam},website:{websiteParam}}) Return n',
         {idSuperMarketParam:idSuperMarket,nameParam:name,descriptionParam:description,addressParam:address,latitudeParam:latitude,longitudeParam:longitude,typeSuperMarketParam:typeSuperMarket,telephoneParam:telephone,ratingParam:rating,scheduleParam:schedule,websiteParam:website})
        
         .then(result =>{
            session.close();   
          
            // on application exit:
            driver.close();             
        })
        .catch(function(err){
            console.log(err);
        })
    };

    //Insert clients
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
          
            console.log(node.properties.name);
          
            // on application exit:
            driver.close();
          });
    };


//Insert orders
    session
        .run('MATCH (n)DETACH DELETE n')
        .then(function(result){
            session.close();                
        })
        .catch(function(err){
            console.log(err);
        })

    const mongoOrders = await orders.find();

    for(var i = 0; i < mongoOrders.length; i++){
        const order = mongoOrders[i];

     
        const idOrden = order.id;
        //console.log(date);
        const date = order.date.toString();
        const time = order.time.toString();
        const status = order.status;
        const particularNeeds = order.particularNeeds;
        const idClient = order.idClient;
        const idSuperMarket = order.idSuperMarket;
        const totalAmount = order.totalAmount.toString();

        const resultPromise = session
        .run('CREATE (n:orders {idOrden:{idParam},date:{dateParam},status:{statusParam},particularNeeds:{particularNeedsParam},idClient:{idClientParam},idSuperMarket:{idSuperMarketParam},totalAmount:{totalAmountParam}}) Return n',
         {idParam:idOrden, dateParam:date, timeParam:time, statusParam:status, particularNeedsParam:particularNeeds,idClientParam:idClient,idSuperMarketParam:idSuperMarket, totalAmountParam:totalAmount })


         const mongoProductsOrder = order.products();
 
         for(var i = 0; i < mongoProductsOrder.length; i++){
             const product = mongoProductsOrder[i];
             const idProduct = product.productID;
             const nameProduct = product.productName;
             const amountProduct = product.amount;

             const resultPromise = session
             .run('CREATE (n:products {idProduct:{idParam},name:{nameParam},amount:{amountParam}}) Return n',
             {idParam:idProduct, nameParam:nameProduct, amountParam:amountProduct })
                session.close();
              
                const singleRecord = result.records[0];
                const node = singleRecord.get(0);
              
                console.log(node.properties.name);
              
                // on application exit:
                driver.close();
              
             
             const resultPromiseb = session
             .run('MATCH (a:orders {idOrden:{idOrdenParam}}),(b:products{idProduct:{idProductParam}}) MERGE(b)-[r:LEAVES_FROM]-(a) RETURN a,b', {idProduct:idProduct, idOrder:idProduct})
             resultPromiseb.then(result => {
                session.close();
              
                const singleRecord = result.records[0];
                const node = singleRecord.get(0);
              
                console.log(node.properties.name);
              
                // on application exit:
                driver.close();
              });
              
         }
         resultPromise.then(result => {
            session.close();
          
            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
          
            console.log(node.properties.name);
          
            // on application exit:
            driver.close();
          });
    };


    //Connection between orders and markets

    for(var i = 0; i < mongoOrders.length; i++){
        const order = mongoOrders[i];
        const idOrderCmp= order.idSuperMarket;     
        for(var j = 0; j < mongoSupermarkets.length; j++){
            const supermarket = mongoSupermarkets[j];
            const idSuperMarketCmp = supermarket. idSuperMarket;

            if (idSuperMarketCmp== idOrderCmp){
                session
                    .run('MATCH (a:orders {id:{idParam}}),(b:supermarkets {idSuperMarket:{idSuperMarketParam}}) MERGE(a)-[r:LEAVES_FROM]-(b) RETURN a,b', {idSuperMarketParam:idSuperMarketCmp, idParam:idOrderCmp})
                    .then(function(result){
                        session.close();                
                    })
                    .catch(function(err){
                        console.log(err);
                    })
        
            };

      };

    };

    

    //Connection betwwen orders and clients

    for(var i = 0; i < mongoClients.length; i++){
        const client = mongoClients[i];
        const idClient = client.id;
        
        for(var j = 0; j < mongoOrders.length; j++){
            const order = mongoOrders[j];
            const idOrder = order.idClient;
    

            if(idOrder==idClient){
                const comparator = idOrder;
                session
                    .run('MATCH (a:clients {id:{idParamC}}),(b:orders {id:{idParamO}}) MERGE(a)-[r:ORDER]-(b) RETURN a,b', {idParamC:idClient, idParamO:idOrder})
                    .then(function(result){
                        //console.log(idUser);
                        //console.log(idDelivery);
                        session.close();                
                    })
                    .catch(function(err){
                        console.log(err);
                    })


                for(var k = 0; k < mongoOrders.length; k++){

                    const idSuperMarketP = order.idSuperMarket[k];
        

                    if(idSuperMarketP==comparator){

                        session
                            .run('MATCH (a:supermarkets {id:{idParamM}}),(b:clients {id:{idParamC}}) MERGE(a)-[r:ORDER]-(b) RETURN a,b', {idParamM:comparator, idParamC:comparator})
                            .then(function(result){
                                //console.log(idUser);
                                //console.log(idDelivery);
                                session.close();                
                            })
                            .catch(function(err){
                                console.log(err);
                            })

                    };

                };
            };
        };
    };


}