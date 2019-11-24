const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const app = express();
const router = express.Router();
const connectDb = require('./configuration/server');
const connectNeo = require('./configuration/connectNeo');
const config = require('./configuration/connectDB');
const bodyParser = require('body-parser');
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({extended: true});
const flash = require('connect-flash');
const googleClient = require('./configuration/googleClient');

module.exports = router;

app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

//connectNeo();

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs');
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'tecPlaneApp',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use(require('./routes/index'));
app.use(require('./routes/employees'));
app.use(require('./routes/clients'));
app.use(require('./routes/supermarkets'));
app.use(require('./routes/sites'));
app.use(express.static(__dirname + '/public'));
app.use(router);
app.listen(config.PORT, ()=> console.log(`Server on port ${config.PORT}`));
//var result = googleClient.placeDetailsByCoordinates([9.8497821,-83.9489179]);
//var result = googleClient.searchPlaceByAddress("Walmart Paraiso");
//var result = googleClient.autocompleteQuery("Walmart Costa Rica");
//var result = googleClient.nearbyPlaces([9.8497821,-83.9489179],5000,['store']);
//result.then((res)=>{
// console.log(res);
//});
//googleClient.placeDetailsByCoordinates([9.8497821,-83.9489179]);
connectDb();
