const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patientID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  patientName: {
    type: String,
  },
  doctorID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  doctorName: {
    type: String,
  },
  doctorSpeciality: {
    type: String,
  },
  appointmentDate: {
    type: String,
  },
  appointmentTime: {
    type: String,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
});
const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;
