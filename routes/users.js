const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
var nodemailer = require('nodemailer');


// Load User Model
require('../model/User');
const User = mongoose.model('users');

///login form Post
router.post('/login', passport.authenticate('local', {
        successRedirect: '/photos/upload',
        failureRedirect: '/users/register'
    })
);

router.get('/contact', function(req, res){
    res.render('contact', {qs: req.query});
});


router.get('/login', function(req, res){
    res.render('users/login', {qs: req.query})
});

router.get('/google', (req, res) => {
    //handle with passport
    res.send('logging in with google');
});

router.get('/register', function(req, res){
    res.render('users/register', {qs: req.query})
});

router.post('/register', (req, res) =>{
    let errors = [];

    if(req.body.password != req.body.Repassword){
        errors.push({text: 'password do not match'});
    }
    if(req.body.password.length < 8){
        errors.push({text: 'password must be at least 8 characters'});
    }
    if(errors.length > 0){
        res.render('/users/register', {
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
                res.redirect('/users/register');
                console.log(req.body.email);
            }else{

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'lrmkwanazi38@gmail.com',
              pass: 'lwahndeele'
            }
          });
          var mailOptions = {
            to: req.body.email,
            from: 'no-reply@gmail.com',
            subject: 'Verify',
            text: 'Click here to reset your Password' + ' '+ '\n' +
              'http://' + req.headers.host + '/upload?email= ' +req.body.email+ '\n\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            console.log('mail sent');
            req.flash('success', 'An e-mail has been sent to ' + User.email + ' with further instructions.');
            done(err, 'done');
           // res.render("users/", {});
          });

        bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(newUser.password, salt, (err, hash) =>{
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user => {
                    //req.flash('succes_msg', 'you are now registered and can log in');
                    res.redirect('/users/login');
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

 router.get('/profile', (req, res)=>{
    User.find({})
    .then(user =>{
        res.render('profile', {
            data: user
        });
    });
});

module.exports = router;