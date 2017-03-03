var express = require('express');
var router = express.Router();
var Student = require("../models/student");
var profileRouter = require('./profileRouter');
var passport = require('passport');
router.use('/profile',profileRouter);
var path = require('path');
var fs = require('fs');
var multer =require('multer');

 
 router.use(function(req,res,next){
     req.session.se = "balabizo";
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
});var upload = multer({
    storage:storage
});

router.post('/login',function(req,res){
     
    var username  = req.body.username;
    var pass = req.body.password;
    
    Student.findOne({username : username},function(err,student){
        req.session.username = req.body.username;
        
        if(student !=null && student !=undefined &&student.password == pass)
         {
        
         res.cookie('un',username,{encode : String});
         res.redirect('/');
         }
         else
         {
            
            req.flash("error","wrong password");
            res.redirect('/login');
         }
         
});
})

router.get('/login',function(req,res){
    if((req.cookies.un != null) && (req.cookies.un != undefined))
    res.redirect('/profile');
    else
    res.render('login',{currentStudent:null})

});









router.get('/',function(req,res){
    
res.redirect('/view/1');
});

//pattern matching correct
//db.domain.find( {$where:'this.tag.length>3'} )
router.get('/view/:id',function(req,res){
   var pattern =new RegExp('\\d+');
   if(!pattern.test(req.params.id)){
    res.flash("error","No such page");
    res.redirect('/');

   }
    

    Student.find().$where('this.links.length>0 || this.pics.length>0 ').skip((req.params.id-1)*10).limit(10).exec(function(err,studVar){
        
        
        if(err)
        console.log(err);
        else{
    
   Student.findOne({username:req.cookies.un},function(err,student){ 
    res.render('index',{logged_in :false,students:studVar,currentStudent : student,});});
};

    

    
});
})

router.get('/register',function(req,res){
Student.findOne({username:req.cookies.un},function(err,student)
{
       if(student != null && student != undefined)
       res.redirect('/'); 
       else
       res.render('register',{currentStudent:null});

})


});




router.post('/register',upload.any(),function(req,res){
var username =req.body.username;
var fName = req.body.f_name;
var lName = req.body.l_name;
var password = req.body.password;
var gucMail = req.body.email;
var imgPath  ;
if(req.files[0] != null && req.files[0].path != undefined)
{
    imgPath= req.files[0].path
}
else
{
    imgPath = null;
}

Student.findOne({username:username},function(err,student){
    var newStudent;    
    var  data;
    if(imgPath==null || imgPath==undefined) {
        data =null;
    }
    else
    {
        data = fs.readFileSync(imgPath);
    }
    if(err || (student != null && student != undefined))
    {
        res.send('error');
    }
    else if(lName !=null && lName != undefined)
    {
        
         newStudent = new Student({
            username:username,
            f_name :fName,
            l_name :lName,
            password:password,
            email :gucMail,
            profilePic:{data:data}
        })
        
    }
    else
    {
    newStudent = new Student({
            username:username,
            f_name :fName,
            password:password,
            email :gucMail,
            profilePic:{data:data}
        })
        
    }
    newStudent.save(function(err,data){
        if(err)
    {
        console.log("Error inserting Data  "+err);
        res.redirect('/register');
    }
    else
     {
      if(newStudent.profilePic.data )
      { console.log(data);
          fs.unlink(imgPath,function(err){ if(err)console.log(err)})};   
     console.log("inserting Data done successfully !");
    res.cookie('un',req.body.username);
    res.redirect('/login');    
    }
    });
})

});

module.exports = router;