const express = require("express");
const router = express.Router();
const moment = require("moment");

const { ensureAuthenticated_doctor } = require("../config/auth");

const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Report = require("../models/Report");
const AdminReport = require("../models/AdminReport");
const Availability = require("../models/Availability");

router.get(
  "/doctor/availability",
  ensureAuthenticated_doctor,
  async (req, res) => {
    const availData = await Availability.findOne({
      doctorid: req.user._id,
    });

    res.render("availability", {
      availData,
      user: req.user,
    });
  }
);
//set availability

router.get(
  "/doctor/setAvailability",
  ensureAuthenticated_doctor,
  async (req, res) => {
    res.render("availability_set", {
      user: req.user,
    });
  }
);

router.get(
  "/doctor/updateAvailability",
  ensureAuthenticated_doctor,
  async (req, res) => {
    res.render("availability_update", {
      user: req.user,
    });
  }
);

// appointments handle
router.post("/doctor/set_availability", async (req, res) => {
  const {
    days,
    startTime,
    endTime,
    shift,
    doctorid,
    doctorname,
    speciality,
  } = req.body;
  let errors = [];

  //check required fields
  if (!days || !startTime || !endTime || !shift) {
    errors.push({
      msg: "Please fill in all required fields",
    });
  }

  if (errors.length > 0) {
    res.render("availability_set", {
      errors,
      days,
      startTime,
      endTime,
      shift,
      doctorid,
      doctorname,
      speciality,
      user: req.user,
    });
  } else {
    const newData = new Availability({
      shift,
    });
    if (req.body.days) {
      //If only one value is passed it won't be an array, so you need to create one
      newData.days = Array.isArray(req.body.days)
        ? req.body.days
        : [req.body.days];
    }
    newData.time.startTime = req.body.startTime;
    newData.time.endTime = req.body.endTime;
    newData.doctorid = req.user._id;
    newData.doctorname = req.user.name;
    newData.speciality = req.user.speciality;
    newData.save();
    req.flash("success_msg", "Availability data was successfully uploaded");
    res.redirect("/doctor/availability");
  }
});

router.post("/doctor/update_availability", async (req, res) => {
  const { days, startTime, endTime, shift, doctorid, doctorname } = req.body;
  const result = await Availability.findOneAndUpdate({
    doctorid: req.user._id,
  });
  result.doctorid = req.user._id;
  result.days = req.body.days;
  result.time.startTime = req.body.startTime;
  result.time.endTime = req.body.endTime;
  result.shift = req.body.shift;
  result.doctorname = req.user.name;
  result.speciality = req.user.speciality;
  result.save();
  req.flash("success_msg", "Availability data was successfully updated");
  res.redirect("/doctor/availability");
});

// Search/view patients

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get(
  "/doctor/viewpatients",
  ensureAuthenticated_doctor,
  async (req, res) => {
    Patient.find().exec(async function (err, results) {
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
                res.redirect("/doctor/viewpatients");
              } else {
                res.render("viewpatients", {
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
        res.render("viewpatients", {
          patientCount,
          patients,
          user: req.user,
        });
      }
    });
  }
);

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
        req.report = reports;
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

router.get("/viewpatientsD/:id", ensureAuthenticated_doctor, (req, res) => {
  res.render("patientdetails", {
    patient: req.patient,
    user: req.user,
  });
});

router.get(
  "/viewpatientsD/:id/patientUploadsD",
  ensureAuthenticated_doctor,
  (req, res) => {
    res.render("patientUploads", {
      role: "Doctor",
      patient: req.patient,
      images: req.report,
      user: req.user,
    });
  }
);

router.get(
  "/viewpatientsD/:id/hospitalUploadsD",
  ensureAuthenticated_doctor,
  (req, res) => {
    res.render("hospitalUploads", {
      patient: req.patient,
      role: "Doctor",
      adminimages: req.adminreport,
      user: req.user,
    });
  }
);

module.exports = router;
