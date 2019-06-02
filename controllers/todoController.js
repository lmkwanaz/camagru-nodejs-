var bodyParser = require('body-parser');
var express = require('express');
var bcrypt = require('bcryptjs');
const passport = require('passport')
require('../config/passport');
var mongoose = require('mongoose');

var app = express();
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

// load user Model
require('../model/User');
const User = mongoose.model('users');

// load photos Model
require('../model/Photo');
const Photo = mongoose.model('photos');

//Map global promise
mongoose.Promise = global.Promise;

// connect to  the database
mongoose.connect('mongodb+srv://neo:Lwahndeele1@cluster0-myfbr.mongodb.net/test?retryWrites=true', { useNewUrlParser: true }, () => {
    console.log('connected to mongodb');
})
.then(()=> console.log('MongoDB is now connected'))
.catch(err =>console.log(err));

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

 
    app.get('/', function(req, res){
        //const title = 'welcome';
        res.render('index');
    });

    ///login form Post
    app.post('/login', (req, res, next) =>{
        passport.authenticate('local', {
            successRedirect: '/index',
            failureRedirect: '/register',
            failureFlash: true
        })(req, res, next);
    });

    app.get('/upload', function(req, res){
        res.render('upload', {qs: req.query});
    });
    
    app.get('/contact', function(req, res){
        res.render('contact', {qs: req.query});
    });
    
    app.get('/index', function(req, res){
        res.render('index', {qs: req.query});
    });
    
    app.get('/register', function(req, res){
            res.render('register', {qs: req.query})
    });

    app.get('/login', function(req, res){
        res.render('login', {qs: req.query})
});
    app.post('/upload', urlencodedParser, function(req, res){
        
    })
  
    app.post('/register', urlencodedParser,function(req, res){
        let errors = [];

        if(req.body.password != req.body.Repassword){
            errors.push({text: 'password do not match'});
        }
        if(req.body.password.length < 8){
            errors.push({text: 'password must be at least 8 characters'});
        }
        if(errors.length > 0){
            res.render('/register', {
                errors: errors,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                Repassword: req.body.Repassword
            });
        }else {
            User.findOne({email: req.body.email})
            .then(user => {
                if(user){
                    //req.flash('error_msg', 'Email already registered');
                    res.redirect('/register');
                }else{

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) =>{
                bcrypt.hash(newUser.password, salt, (err, hash) =>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        //req.flash('succes_msg', 'you are now registered and can log in');
                        res.redirect('/login');
                    })
                    .catch(err => {
                        console.log(err);
                        return;
                    });
                });
            });
                }
            });
        }
     });
    
     app.post('/contact', urlencodedParser, function(req, res){
         console.log(req.body);
         res.render('contact', {qs: req.query});
     });
    
    app.get('/profile/:name', function(req, res){
        var data = {age: 29, job: 'ninja', hobbies: ['eating', 'fighting', 'fishing']};
        res.render('profile', {person: req.params.name, data: data});
    });