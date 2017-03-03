var express = require('express');
var Router = require('./router');
var pRouter = express.Router();
var Student = require("../models/student");
var path = require('path');
 var fs = require('fs');
 var mime = require('mime');
var multer = require('multer');
var fs = require('fs');

pRouter.use(function(req,res,next){
     res.locals.errors = req.flash("error");
     res.locals.infos  = req.flash("info");
     Student.count(function(err,count){
         res.locals.count = Math.ceil((count)/10);
     })
     
     next();
 })
 



 var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/tempImages');
    },
   filename: function(req,file,cb)
    {
        cb(null,req.cookies.un+"&&"+Date.now());
    }
});

var upload = multer({
    storage:storage
});


//Must Log in to access any of the features
pRouter.use(express.static(path.join(__dirname, 'public')));
pRouter.use(function protectProfile(req, res, next) {

    Student.findOne({ username: req.cookies.un }, function (err, student) {

        if (student == undefined || student == null || err) {

            res.redirect('../login');
        }
        next();
    })
});


pRouter.get('/', function (req, res) 
{

    Student.findOne({ username: req.cookies.un }, function (err, student) 
    {


        res.render('profile', { currentStudent: student });
    })
});

pRouter.get('/add_work', function (req, res) {
    Student.findOne({ username: req.cookies.un }, function (err, student) {
        res.render("add_work", { currentStudent: student });
        

    })
});

pRouter.post('/add_work', function (req, res) {
    Student.findOne({ username: req.cookies.un }, function (err, student) {
         
            student.links.push({ link: req.body.content, title: req.body.title });
            student.save();
            res.redirect('/profile/add_work');
        
    })

});

pRouter.get('/add_pics',function(req,res){
    Student.findOne({ username: req.cookies.un }, function (err, student) {
        res.render("add_pics", { currentStudent: student });
        

    })
})
pRouter.post('/add_pics',upload.any(),function(req,res){
var imgPath = req.files[0].path;
Student.findOne({username:req.cookies.un},function(err,student){
   var data = fs.readFileSync(imgPath);
   var contentType  ='image/'+path.extname(req.files[0].originalname);
    student.pics.push({
        title:req.body.title,
        data:data,
        dataType:contentType
    });
    student.save(function(err,data){
        if(err)
        console.log(err);
fs.unlink(imgPath,function(err){ if(err)console.log(err)});     
})
})
res.redirect('/profile/add_pics');
})
pRouter.post('/',upload.any(),function(req ,res){
console.log(req.files);
var imgPath = req.files[0].path;
Student.findOne({username:req.cookies.un},function(err,student){
var data = fs.readFileSync(imgPath);
student.profilePic.data = data;   
student.save(function(err,data){
        if(err)
        console.log(err);
fs.unlink(imgPath,function(err){ if(err)console.log(err)});     
})
res.redirect('/profile');
})})
module.exports = pRouter;
