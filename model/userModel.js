const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const UserSchema = mongoose.Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String, required: true},
    avatar: {type: String},
    father_name: {type: String},
    city: {type: String},
    state: {type: String},
    location: {type: String},
    zip_code: {type: String},
    mobile: {type: String},
    facebook_profile: {type: String},
    twitter_profile: {type: String},
    KYC: {type: String}
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByEmail = function(email, callback){
    const query = {email: email}
    User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if(err)
            throw err;
        callback(null, isMatch);
    });
}