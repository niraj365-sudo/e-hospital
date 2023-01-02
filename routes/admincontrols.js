const express = require("express");
const router = express.Router();

// //patient model
const Patient = require("../models/Patient");
// // doctor model
const Doctor = require("../models/Doctor");
const Report = require("../models/Report");
const AdminReport = require("../models/AdminReport");
const Availability = require("../models/Availability");

const { ensureAuthenticated_admin } = require("../config/auth");

// Search/view patients

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/viewpatients", ensureAuthenticated_admin, async (req, res) => {
  Patient.find().exec(async function (err, results) {
    //To count total number of patients
    var patientCount = results.length;

    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), "gi"); // g= global ; i=ignore case or smth
      await Patient.find(
        {
          name: regex,
        },
        function (err, patients) {
          // const patients =  await Patient.find({name:regex}){
          if (err) {
            //  Garnu jastai ho
            throw err;
          } else {
            if (patients.length < 1) {
              req.flash(
                "error_msg",
                "Sorry! Patient not found,please try again"
              );
              res.redirect("/viewpatients");
            } else {
              res.render("adminviewpatients", {
                patientCount,
                patients: patients, //just patients yo line ma incase --->const patients
                user: req.user, //which is done above
              });
            }
          }
        }
      );
    } else {
      const patients = await Patient.find({});
      res.render("adminviewpatients", {
        patientCount,
        patients,
        user: req.user,
      });
    }
  });
});

// view more details of patient

router.param("id", function (req, res, next, _id) {
  Patient.findOne(
    {
      _id,
    },
    function (err, details) {
      if (err) res.json(err);
      else {
        req.patient = details;
        next();
      }
    }
  );
});
router.param("id", function (req, res, next, patientid) {
  Report.find(
    {
      patientid,
    },
    function (err, reports) {
      if (err) res.json(err);
      else {
        req.reports = reports;
        next();
      }
    }
  );
});

router.param("id", function (req, res, next, toPatient) {
  AdminReport.find(
    {
      toPatient,
    },
    function (err, adminreports) {
      if (err) res.json(err);
      else {
        req.adminreport = adminreports;
        next();
      }
    }
  );
});

router.get("/viewpatients/:id", ensureAuthenticated_admin, (req, res) => {
  res.render("adminPatientdetails", {
    patient: req.patient,
    user: req.user,
  });
});

//To see patient uploads
router.get(
  "/viewpatients/:id/patientUploads",
  ensureAuthenticated_admin,
  async (req, res) => {
    res.render("patientUploads", {
      role: "Admin",
      images: req.reports,
      patient: req.patient,
      user: req.user,
      
    });
  }
);
8
router.get(
  "/viewpatients/:id/hospitalUploads",
  ensureAuthenticated_admin,
  (req, res) => {
    res.render("hospitalUploads", {
      role: "Admin",
      patient: req.patient,
      adminimages: req.adminreport,
      user: req.user,
    });
  }
);

// Search/view doctors

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/viewdoctors", ensureAuthenticated_admin, async (req, res) => {
  Doctor.find().exec(async function (err, results) {
    var doctorCount = results.length;

    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), "gi"); // g= global ; i=ignore case or smth
      await Doctor.find(
        {
          name: regex,
        },
        function (err, doctors) {
          // const doctors =  await Doctor.find({name:regex}){
          if (err) {
            //  Garnu jastai ho
            throw err;
          } else {
            if (doctors.length < 1) {
              req.flash(
                "error_msg",
                "Sorry! Doctor not found,please try again"
              );
              res.redirect("/viewdoctors");
            } else {
              res.render("adminviewdoctors", {
                doctorCount,
                doctors: doctors, //just doctors yo line ma incase --->const doctors
                user: req.user, //which is done above
              });
            }
          }
        }
      );
    } else {
      const doctors = await Doctor.find({});
      res.render("adminviewdoctors", {
        doctorCount,
        doctors,
        user: req.user,
      });
    }
  });
});

// view more details of doctor

router.param("id", function (req, res, next, _id) {
  Doctor.findOne(
    {
      _id,
    },
    function (err, details) {
      if (err) res.json(err);
      else {
        req.doctor = details;
        next();
      }
    }
  );
});

router.param("id", function (req, res, next, doctorid) {
  Availability.findOne(
    {
      doctorid,
    },
    function (err, availability) {
      if (err) res.json(err);
      else {
        req.availability = availability;
        next();
      }
    }
  );
});

router.get("/viewdoctors/:id", ensureAuthenticated_admin, (req, res) => {
  res.render("adminDoctordetails", {
    availability: req.availability,
    doctor: req.doctor,
    user: req.user,
  });
});

module.exports = router;
