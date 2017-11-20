const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const config = require('../config/database');

//Register User
router.post('/userRegister', function(req, res, next){
    const newUser = new User({
        name: "",
        email: "",
        password: "",
        avatar: "",
        father_name: "",
        city: "",
        state: "",
        location: "",
        zip_code: "",
        mobile: "",
        facebook_profile: "",
        twitter_profile: "",
        KYC: ""
    });

    User.count({email: newUser.email}, function(errr, count){
        if(count > 0){
            res.json({
                success: false,
                msg: "User Already Exist"
            })
        } else{
            User.addUser(newUser, function(err, suc){
                if(err){
                    res.json({
                        success: false,
                        msg: 'Failed To Register User'
                    })
                }else{
                    res.json({
                        success: true,
                        msg: 'User Registered Successfully'
                    });
                }
            });
        }
    });
    
});

//Login User
router.post('/userLogin', function(req, res, next){
    const email = req.body.email;
    const password = req.body.password;
    User.getUserByEmail(email, function(err, user){
        if(err){
            throw err;
        }
        if(!user){
            res.json({
                success: false,
                msg: "User Not Found"
            });
        }
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err)
                console.log(err);
            if(isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 //1 Week
                });

                res.json({
                    success: true,
                    token: 'JWT '+token,
                    personalName: user.ownerFirstName,
                    storeName: user.storeName,
                    email: user.ownerEmail,
                    id: user._id
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

//User Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), function(req, res, next){
    res.json({user: req.user});
    // console.log(req.user);
});

module.exports = router;