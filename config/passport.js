const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
var todoController = require('../controllers/todoController');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/// Load user model
const User = require('../model/User');

       passport.serializeUser(function(user, done){
        done(null,user.id);
    });
    passport.deserializeUser(function(id,done){
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use(new LocalStrategy({ usernameField: 'email'},function(email,password,done){
           // local Strategy
           let query = {email:email};
           User.findOne(query, function(err, user){
               if(err) throw err;
               if(!user){
                   console.log('no user');
                   return done(null, false, {message: 'No user found'});
               }
    
               // match Password
               bcrypt.compare(password,user.password, function(err,isMatch){
                   if(err) throw err;
                   if(isMatch){
                    console.log("auth");
                       return done(null, user);
                   }else{
                       console.log("no auth");
                   return done(null, false, {message: 'Wrong Password'});
    
                   }
               })
           })
    }))


   // passport.use(new GoogleStrategy);