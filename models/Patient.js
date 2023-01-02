const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    tokennumber: {
        type: String,
        required: true
    },
    name: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    imageUrl:{
        type:String
    },
    date: {
        type: Date,
        default: Date.now
    }

});

const Patient = mongoose.model('Patient',PatientSchema);

module.exports =  Patient;

