const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Seller = require('../model/sellerModel');
const config = require('../config/database');

//Register User
router.post('/sellerRegister', function(req, res, next){
    const newSeller = new Seller({
        storeName: "",
        storeId: "",
        storeAddress: "",
        storeState: "",
        storeDistrict: "",
        storePin: "",
        storePan: "",
        storeAdhaar: "",
        ownerFirstName: "",
        ownerLastName: "",
        ownerEmail: req.body.email,
        ownerMobile1: "",
        ownerMobile2: "",
        ownerAddress: "",
        ownerPan: "",
        ownerAdhaar: "",
        bankName: "",
        accountNumber: "",
        accountHolderName: "",
        ifscCode: "",
        password: req.body.password
    });

    Seller.count({ownerAdhaar: newSeller.ownerAdhaar}, function(errr, count){
        if(count > 0){
            res.json({
                success: false,
                msg: "Seller Already Exist"
            })
        } else{
            Seller.addSeller(newSeller, function(err, suc){
                if(err){
                    res.json({
                        success: false,
                        msg: 'Failed To Register Seller'
                    })
                }else{
                    res.json({
                        success: true,
                        msg: 'Seller Registered Successfully'
                    });
                }
            });
        }
    });
    
});

//Get All Seller
router.post('/getall', passport.authenticate('jwt', {session: false}), function(req, res){
    Seller.find({}, function(err, cat){
        if(err)
            throw err;
        else{
            res.json({
                success: true,
                msg: "Seller Retrieved Successfully",
                data: cat
            });
        }
    });
});

//Get Seller By UID
router.post('/getByUid', passport.authenticate('jwt', {session: false}), function(req, res){
    Seller.find({storeId: req.body.uid}, function(err, cat){
        if(err)
            throw err;
        else{
            res.json({
                success: true,
                msg: "Seller Retrieved Successfully",
                data: cat
            });
        }
    });
});

//Update Category
router.post('/updateSeller', passport.authenticate('jwt', {session: false}), function(req, res, next){
    const editData = {
        storeName: req.body.sellData.sname,
        storeAddress: req.body.sellData.saddress,
        storeState: req.body.sellData.sstate,
        storeDistrict: req.body.sellData.sdistrict,
        storePin: req.body.sellData.spin,
        storePan: req.body.sellData.span,
        storeAdhaar: req.body.sellData.sadhaar,
        ownerFirstName: req.body.sellData.ofname,
        ownerLastName: req.body.sellData.olname,
        ownerEmail: req.body.sellData.oemail,
        ownerMobile1: req.body.sellData.omob1,
        ownerMobile2: req.body.sellData.omob2,
        ownerAddress: req.body.sellData.oaddress,
        ownerPan: req.body.sellData.opan,
        ownerAdhaar: req.body.sellData.oadhaar,
    };
    Seller.updateOne({"_id": req.body.id}, {$set: editData}, function (err, updt) {
        if (err) {
            throw err;
        } else {
            res.json({
                success: true,
                msg: "Seller Updated Successfully"
            });
        }
    });
});

//Delete Seller
router.post('/deleteSeller', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    Seller.deleteOne({"_id": req.body.selDel.id}, function (err, dlt) {
        if (err) {
            throw err;
        } else {
            res.json({
                success: true,
                msg: "Seller Deleted Successfully"
            });
        }
    });
});

router.post('/sellerLogin', function(req, res, next){
    const email = req.body.useremail;
    const password = req.body.password;
    User.getUserByEmail(email, function(err, user){
        if(err){
            throw err;
        }
        if(!user){
            return res.json({
                success: false,
                msg: "User Not Found"
            });
        }
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err)
                throw err;
            if(isMatch){
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 //1 Week
                });

                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        type: user.type
                    }
                });
            }else{
                return res.json({
                    success: false,
                    msg: 'Wrong Password'
                });
            }
        });
    });
});

module.exports = router;