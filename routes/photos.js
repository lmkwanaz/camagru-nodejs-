const express = require('express');
const mongoose = require('mongoose');
const router = express.Router(); 
var fs = require('fs');

// Load Photo Model
require('../model/Photo');
const Photos = mongoose.model('photos');

router.get('/upload', function(req, res){
     res.render('photos/upload', {qs: req.query});
   // res.send('ok');
});

///upload backend
router.post('/upload', function(req, res, next){
  var base64Data = req.body.img_src.replace(/^data:image\/png;base64,/, "");
  var name = "out.png";
  var path =  __dirname + "/../source/" + name;
  fs.writeFile(path , base64Data, 'base64', function(err) {
    if (err) throw err;
    
    const image = new Photos({
      //  username: req.body._id,
      img_src: req.body.img_src
    });
    image.save().then(function(savedImage){
      // console.log(req.body.img_src + " saved image:\n" + savedImage);
      res.render('photos/upload', {image_name: name});
    });
    
  });
});

//webcam Backend
router.post('/webcam', function(req, res, next){
    var base64Data = req.body.cam_image.replace(/^data:image\/png;base64,/, "");
    var name = "out.png";
    var path =  __dirname + "/../source/" + name;
    fs.writeFile(path , base64Data, 'base64', function(err) {
      if (err) throw err;
      
      const image = new Photos({
       // name: _id,
        img_src: req.body.cam_image
      });
      image.save().then(function(savedImage){
        //console.log(req.body.cam_image + " saved image:\n" + savedImage);
        res.render('photos/webcam', {image_name: name});
      });
      
    });
});


router.get('/webcam', function(req, res){
  res.render('Photos/webcam', {qs: req.query})
});

module.exports = router;