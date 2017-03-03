var mongoose = require('mongoose');
var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR =10;


var studentSchema =mongoose.Schema({
    username:{type :String,required:true,unique:true},
    f_name : {type :String,required:true},
    l_name : {type :String},
    password : {type:String,required:true},
    email : {type:String,required:true,unique:true},
    pics : [{ title:String,data:Buffer ,dataType:String }],
    links :[{link:String,title:String}],
    profilePic:{data:Buffer}
});

var doNothing = function() {};

studentSchema.pre("Save",function(done){
var student  =this;
if(!student.isModified(password))
return done();
bcrypt.genSalt(SALT_FACTOR,function(err,salt){
if(err) return done(err);
bcrypt.hash(this.password,salt,doNothing,function(err,hashedPassword){
if(err) return done(err);
user.password = hashedPassword;
done();
});
});
});
studentSchema.methods.checkPassword= function(guess,done){
bcrypt.compare(guess,this.password,function(err,isMatch){
    console.log(isMatch +" Check Pass");
done(err,isMatch);  
});
};
var Student = mongoose.model('Student',studentSchema);
module.exports= Student;