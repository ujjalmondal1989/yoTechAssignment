// external imports
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');

// custom imports
var secret = require('./config/secret');

//import model
var User = require('./models/user');

//Routes
var mainRoutes = require('./routes/main');
var errorRoutes = require('./routes/error');

// initialize express
var app = express();

// connect node to mongodb
mongoose.connect(secret.database,{useCreateIndex: true,useNewUrlParser: true}, function(err){
	if (err) {
		console.log("Make sure the database server is running " + err);
	}else{
		console.log("Connected to the database");
	}
});

//middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: secret.secretKey,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(flash());

// set the view
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// make use of our passport module
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
	// assign each route the user object
	res.locals.user = req.user;
	next();
});

// make use of the routes
app.use(mainRoutes);
app.use(errorRoutes);

app.get('/*', function(req, res, next){
	if (typeof req.cookies['connect.sid'] !== 'undefined') {
		console.log(req.cookies['connect.sid']);
	}
});

// configure the server's listen port and give user feedback
app.listen(secret.port, function(err){
	if(err) throw err;
	console.log("Go to http://localhost:" + secret.port + " in your browser");
});