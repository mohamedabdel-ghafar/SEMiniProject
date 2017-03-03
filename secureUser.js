var passport = require("passport");
var Student = require('./models/student');
var LocalStrategy = require("passport-local").Strategy;

passport.use("login",new LocalStrategy(function (email,password,done){
    Student.findOne({email:email},function(err,student){
       if(err)
       return done(err);
       else if(! student)
       {
           return done(err,false,{message:"No match found"});
       }
       else
       {
       student.checkPassword(password, function(err, isMatch) 
       {
        if(err)
        return done(err);
        if(isMatch)
        return done(null,student);
        else
        return done(err,false,{message:"Wrong Password"});
       });

       }

    });
}));
module.exports = function(){
    passport.serializeUser(function(student, done) {
done(null, student._id);
});
passport.deserializeUser(function(id, done) {
Student.findById(id, function(err, student) {
done(err, student);
});
});
};
