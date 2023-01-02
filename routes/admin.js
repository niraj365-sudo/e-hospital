const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');


const Admin = require('../models/Admin');

//passport config
require('../config/passport');

//login page
router.get('/adminLogin', (req, res) => res.render('adminLogin')); //arrowfunc with req and res object

//register page
router.get('/adminRegister', (req, res) => res.render('adminRegister'));

// register handle
router.post('/adminRegister', (req, res) => {

    const {
        name,
        email,
        password,
        password2,
    } = req.body
    const {
        imageUrl = 'https://res.cloudinary.com/nazus/image/upload/v1587475204/cakut3nckczmbtfnhmsk.png'
    } = req.body; //for default image (unorthodox way)
    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill in all required fields'
        });
    }

    //check password match
    if (password !== password2) {
        errors.push({
            msg: 'Passwords do not match'
        });
    }

    //check pass length
    if (password.length < 6) {
        errors.push({
            msg: 'Password length should be at least six characters'
        });
    }

    if (errors.length > 0) {
        res.render('adminRegister', { //suppose kunai condition meet garena bhane ni tei page ma basne bhayo
            errors, //register lai rendering garda errors lai pathairacha which is checked in messages 
            name,
            email,
            password,
            password2
        });
    } else {
        //validation passed
        Admin.findOne({
                email: email
            })
            .then(admin => {
                if (admin) {
                    // exists
                    errors.push({
                        msg: 'Email is already registered'
                    });
                    res.render('adminRegister', { //if their is user re render the reg form and send error  
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else { //if there is new  user we have to create a user
                    const newUser = new Admin({
                        name, // name:name,
                        email,
                        password,
                        imageUrl
                    });

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //set password to hash
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then(admin => {
                                    req.flash('success_msg', 'You are now registered and can log in'); //calling flash msg after success
                                    res.redirect('/admin/adminLogin'); //localhst ma k path handa kata jane 
                                })
                                .catch(err => console.log(err));
                        }))
                }
            });
    }

});

//Admin login handle
router.post('/adminLogin',
    passport.authenticate('admin', {
        successRedirect: '/admindashboard',
        failureRedirect: '/admin/adminLogin',
        failureFlash: true
    }));

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});



module.exports = router;