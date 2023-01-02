const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

const {
    ensureAuthenticated_doctor
} = require('../config/auth');

const Doctor = require('../models/Doctor');

// const {
//     db
// } = require('../models/RegNum')

var i;
var answer = [];
// db.collection("RegNum").findOne({}, function (err, result) {
//     if (err) throw err;
//     var len = result.regnum_doctor.length;
//     //console.log(len);
//     for (i = 0; i < len; i++) {
//         answer.push(result.regnum_doctor[i]);
//         //console.log(answer);
//     }
//     // console.log(answer);
// })



//passport config
require('../config/passport');

// login page
router.get('/Dlogin', (req, res) => res.render('logindr'));

//register page
router.get('/Dregister', (req, res) => res.render('registerdr'));

// register handle
router.post('/Dregister', (req, res) => {
    const {
        regNumber,
        name,
        email,
        password,
        password2,
        salutation,
        phonenumber,
        experience,
        speciality,
        qualification,
        gender,
        description
    } = req.body;
    const {
        imageUrl = 'https://res.cloudinary.com/nazus/image/upload/v1587475204/cakut3nckczmbtfnhmsk.png'
    } = req.body;
    let errors = [];

    //check required fields
    if (!regNumber || !name || !email || !password || !password2 || !salutation || !phonenumber || !experience || !speciality || !qualification || !gender || !description) {
        errors.push({
            msg: 'Please fill in all required fields'
        });
    }

    //check regNumber
    // if (answer.every(function (val) {
    //         return val != regNumber;
    //     })) {
    //     errors.push({
    //         msg: 'Invalid Registration Number'
    //     });
    //     //console.log(answer)
    // }

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
        res.render('registerdr', { //suppose kunai condition meet garena bhane ni tei page ma basne bhayo
            errors, //register lai rendering garda errors lai pathairacha which is checked in messages 
            regNumber,
            name,
            email,
            password,
            password2,
            salutation,
            phonenumber,
            experience,
            speciality,
            qualification,
            gender,
            description
        });
    } else {
        //validation passed
        Doctor.findOne({
                email: email
            })
            .then(doctor => {
                if (doctor) {
                    // exists
                    errors.push({
                        msg: 'Email is already registered'
                    });
                    res.render('registerdr', { //if their is user re render the reg form and send error  
                        errors,
                        regNumber,
                        name,
                        email,
                        password,
                        password2,
                        salutation,
                        phonenumber,
                        experience,
                        speciality,
                        qualification,
                        gender,
                        description
                    });
                } else { //if there is new  user we have to create a user
                    const newUser = new Doctor({
                        name, // name:name,
                        email,
                        password,
                        salutation,
                        phonenumber,
                        experience,
                        speciality,
                        qualification,
                        gender,
                        description,
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
                                .then(doctor => {
                                    req.flash('success_msg', 'You are now registered and can log in'); //calling flash msg after success
                                    res.redirect('/doctor/Dlogin'); //localhst ma k path handa kata jane 
                                })
                                .catch(err => console.log(err));
                        }))
                }
            });
    }

});

//doctor login handle  
router.post('/Dlogin',
    passport.authenticate('doctor', {
        successRedirect: '/doctordashboard',
        failureRedirect: '/doctor/Dlogin',
        failureFlash: true
    }));


// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});


module.exports = router;