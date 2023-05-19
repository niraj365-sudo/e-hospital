const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Feedback = require('../models/Feedback');
const Availability = require('../models/Availability')
const {
    ensureAuthenticated_patient,
    ensureAuthenticated_doctor,
    ensureAuthenticated_admin
} = require('../config/auth');

// Welcome Page
router.get('/', (req, res) => res.render('Home', {
    layout: 'layouts/loginLayout'
}));

//welcome page patient
router.get('/patient/welcome', (req, res) => res.render('welcome'));

//welcome page doctor
router.get('/doctor/welcomedr', (req, res) => res.render('welcomedr'));


//doctordashboard
router.get('/doctordashboard', ensureAuthenticated_doctor, async (req, res) => {
    res.render('doctordashboard', {
        user: req.user
    })
})

//patientdashboard page
router.get('/patientdashboard', ensureAuthenticated_patient, async (req, res) => {
    res.render('patientdashboard', {
        user: req.user
    })
})

//admindashboard page
router.get('/admindashboard', ensureAuthenticated_admin, async (req, res) => {

    Patient.find().exec(function (err, results) { //To count total number of registered patients
        var patientCount = results.length

        Doctor.find().exec(function (err, results) { //To count total number of registered doctors
            var doctorCount = results.length

            Feedback.find().exec(function (err, results) { //To count total number of feedbacks sent by patients
                var feedbackCount = results.length

                res.render('admindashboard', {
                    user: req.user,
                    patientCount,
                    doctorCount,
                    feedbackCount
                })
            })
        })
    })
})

module.exports = router;