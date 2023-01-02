const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  salutation: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: Number,
  },
  experience: {
    type: Number,
  },
  speciality: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
  },
  gender: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Doctor = mongoose.model("Doctor", DoctorSchema);

module.exports = Doctor;
