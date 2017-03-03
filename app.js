var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var logger = require('morgan');
var session = require('express-session');
var Student = require("./models/student");
var mongoose =require('mongoose');
var router= require("./routes/router");
var profileRouter= require("./routes/profileRouter");
var flash = require("connect-flash");
var passport = require("passport");
var secureUser= require("./secureUser");
var cookieParser = require("cookie-parser");
secureUser();

app.use(logger('dev'));

app.use(session({
    secret : "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX"
   // saveUninitialized : true,
    //resave:true
}))

//app.use(passport.initialize());
//app.use(session({secret:'dfghdff3p32p534tklenlgndfasczxxbvcvb',resave:true,saveUninitialized:true}));
//app.use(passport.session());
app.use(flash());
app.use('/def-male.png',express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));
mongoose.connect("mongodb://localhost:27017/mini-project",function(err){
    if(err)
    {
        console.log("Connection to Mongodb Failed!");
    }
});
app.use(cookieParser());
app.use('/',router);
http.createServer(app).listen(3000);