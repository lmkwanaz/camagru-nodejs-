var express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
 const exphbs = require('express-handlebars');
//const methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
 //var todoController = require('./controllers/todoController');
 var app = express();


// passport config
require('./config/passport');
// Load routes
const photos = require('./routes/photos');
const users = require('./routes/users');


//    // load user Model
// require('./model/User');
// const User = mongoose.model('users');

// // load photos Model
// require('./model/Photo');
// const Photo = mongoose.model('photos');

//Map global promise
mongoose.Promise = global.Promise;

// connect to  the database
mongoose.connect('mongodb+srv://neo:Lwahndeele1@cluster0-myfbr.mongodb.net/test?retryWrites=true', { useNewUrlParser: true }, () => {
    console.log('connected to mongodb');
})
.then(()=> console.log('MongoDB is now connected'))
.catch(err =>console.log(err));

//set up handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Set post size limit
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

//satic files
 app.use('/assets', express.static('assets'));
app.use('assets', express.static(path.join(__dirname, 'assets')));

// Method override middleware
//app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variable
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
        next();
});

// Index Route
app.get('/', (req, res) => {
    res.render('index');
  });
  
//   app.get('/login', (req, res) => {
//     res.render('/login');
//   });

//   // About Route
//   app.get('/register', (req, res) => {
//     res.render('/register');
//   });

//ste up template engine
//app.set('view engine', 'ejs');

//use routes
app.use('/photos', photos);
app.use('/users', users);


//fire controllers
//users(app);


//listen to port
  app.listen(7000, () =>{
      console.log('you are now listening to port 7000');
  }); 

