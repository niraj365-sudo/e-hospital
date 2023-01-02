const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
    days: {
        type: Array
    },
    time: {
        startTime: {
            type: String
        },
        endTime: {
            type: String
        }
    },
    shift: {
        type: String
    },
    doctorid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor'
    },
    doctorname:{
        type:String,
        ref:'doctor'
    },
    speciality:{
        type:String,
        ref:'doctor'
    }
});

const Availability = mongoose.model('Availability', AvailabilitySchema);

module.exports = Availability;