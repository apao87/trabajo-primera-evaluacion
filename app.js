var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

// connection
var mongoose = require('mongoose');
var user = 'josu';
var password = 'josu';

// database connection
mongoose.connect('mongodb://'+user+':'+password+'@ds063909.mongolab.com:63909/proyectocoach');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
console.log('Database connection OK!');
});


passport.serializeUser(function(user, done) {
done(null, user);
});
passport.deserializeUser(function(user, done) {
done(null, user);
});

// schema
var usersSchema = mongoose.Schema({
name: String,
password: String
});

// model
var users = mongoose.model('users', usersSchema);


passport.use(new LocalStrategy(
function(username, password, done) {

// find
// http://mongoosejs.com/docs/api.html#model_Model.find
//app.get('/kittens/findall', function(req, res){
// find all
users.find({ name: username }, function (err, users) {
if (err) return console.error(err);
console.log('Buscar usuario: ');
console.log(users);

var hash = users[0].password;


//var hash = '$2a$10$jwDOXQmYn/LDO291d1C0h.yPDVeh4Z11QWQ/DMLGmhf52XNCgFugm';
//if ((username == 'koxme') && (bcrypt.compareSync(password, hash))) {
	if ((username == users[0].name) && (password==hash)){
// login OK
return done(null, username);
} else {
// login KO
return done(null, false);
}
// if (username == 'koxme') {
// // hash of koxme password
// var hash = '$2a$10$jwDOXQmYn/LDO291d1C0h.yPDVeh4Z11QWQ/DMLGmhf52XNCgFugm';
// bcrypt.compare(password, hash, function(err, res) {
// if (res) {
// // password OK
// return done(null, username);
// } else {
// // password KO
// return done(null, false);
// }
// });
// } else {
// // username KO
// return done(null, false);
// }
	});
}
));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'dasjdhuueneud8jndsuswhjndh',
saveUninitialized: true,
resave: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
// public files
app.use(express.static(__dirname + '/public'));
app.post('/login',
passport.authenticate('local', { successRedirect: '/loginSuccess',
failureRedirect: '/loginFailure',
failureFlash: false })
);
app.get('/', function(req,res) {
res.redirect('index.html');
});
app.get('/loginFailure', function(req,res) {
res.send('Login KO. username/password incorrect');
});
app.get('/loginSuccess', ensureAuthenticated, function(req,res) {
res.send('Login OK. Hello ' + req.user);
});
// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/');
}
app.get('/logout', function(req, res){
req.logout();
res.redirect('/');
});
app.get('/otherpage', ensureAuthenticated, function(req, res){
res.send('other page');
});
var server = app.listen(process.env.PORT || 3000, function(){
console.log('Listening in port %d', server.address().port);

});