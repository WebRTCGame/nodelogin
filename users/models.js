'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// ...
// define the emailSchema
var emailSchema = new Schema({
 // Since `type` is special keyword in mongoose we must set the def. to
 // and object. I.e. this would not work:
 // type: String,
 type  : {type: String},
 value : String
});

// define the userSchema
var userSchema = new Schema({
 name  : {
   givenName   : String,
   familyName  : String
 },
 emails: [emailSchema]
});
// ...
// Export the User model
var bcrypt = require('bcrypt');

// Constants
var BCRYPT_COST = 12;

//...

userSchema.statics.hashPassword = function (passwordRaw, fn) {
 // To speed up tests, we do a NODE_ENV check.
 // If we are in the test environment we set the BCRYPT_COST = 1
 if (process.env.NODE_ENV === 'test') {
   BCRYPT_COST = 1;
 }
 // encrypt the password using bcrypt; pass the callback function
 // `fn` to bcrypt.hash()
 bcrypt.hash(passwordRaw, BCRYPT_COST, fn);
};

userSchema.statics.comparePasswordAndHash = function (password, passwordHash, fn) {
 // compare the password to the passwordHash
 bcrypt.compare(password, passwordHash, fn);
};

exports.User = mongoose.model('User', userSchema);