const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const SellerSchema = mongoose.Schema({
    storeName: {type: String},
    storeId: {type: String},
    storeAddress: {type: String},
    storeState: {type: String},
    storeDistrict: {type: String},
    storePin: {type: String},
    storePan: {type: String},
    storeAdhaar: {type: String},
    ownerFirstName: {type: String},
    ownerLastName: {type: String},
    ownerEmail: {type: String},
    ownerMobile1: {type: String},
    ownerMobile2: {type: String},
    ownerAddress: {type: String},
    ownerPan: {type: String},
    ownerAdhaar: {type: String},
    bankName: {type: String},
    accountNumber: {type: String},
    accountHolderName: {type: String},
    ifscCode: {type: String},
    password: {type: String, required: true}
});

const Seller = module.exports = mongoose.model('Seller', SellerSchema);

module.exports.addSeller = function(newSeller, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newSeller.password, salt, function(err, hash){
            if(err) throw err;
            newSeller.password = hash;
            newSeller.save(callback);
        });
    });
}

module.exports.getSellerById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getSellerByEmail = function(email, callback){
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