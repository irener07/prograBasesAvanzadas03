
const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'Abcd1234'));
console.log('Buena');
const session = driver.session();
const personName = 'Alice';

module.exports= () =>{
const resultPromise = session.run( 
    'CREATE (n:ProductTTTT) Return n',
);

resultPromise.then(result => {
  session.close();

  const singleRecord = result.records[0];
  const node = singleRecord.get(0);

  console.log(node.properties.name);

  // on application exit:
  driver.close();
});
}


