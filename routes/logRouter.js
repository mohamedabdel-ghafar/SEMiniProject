var lRouter = (require('express')).Router();
var session = require("express-session");
var Student = require('../models/student');
var passport = require('passport');

 
lRouter.use(function(req, res, next) {
res.locals.email = req.student;
next();
});
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) {
next();
} else {
req.flash("info", "You must be logged in to see this page.");
res.redirect("/log-in");
}
}
/*
lRouter.post('/',function(req,res){
  var g_mail = req.body.email;
 var pass = req.body.password;
var checkPass= Student.findOne({email:g_mail},function validate(err,student){

if(student.password==pass){
    
   req.session.email = g_mail;
     res.locals.email = g_mail;
    res.redirect('../');

}
else{
    
    res.redirect('/');
}

});


});
*/
lRouter.post("/", passport.authenticate("login", {
successRedirect: "../",
failureRedirect: "/"
}));
lRouter.get('/',function(req,res){
    res.render('log-in');
});
module.exports = lRouter;