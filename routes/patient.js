const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const passport = require("passport");
const moment = require("moment");

const { ensureAuthenticated_patient } = require("../config/auth");

//passport config
require("../config/passport");

//Models
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Availability = require("../models/Availability");
const { db } = require("../models/RegNum");

var i;
var answer = [];
// db.collection("RegNum").findOne({}, function (err, result) {
//   if (err) throw err;
//   var len = result.regnum_patient.length;
//   //console.log(len);
//   for (i = 0; i < len; i++) {
//     answer.push(result.regnum_patient[i]);
//     //console.log(answer);
//   }
//   // console.log(answer);
// });

//login page
router.get("/login", (req, res) => res.render("login")); //arrowfunc with req and res object

//register page
router.get("/register", (req, res) => res.render("register"));

//register handle
router.post("/register", (req, res) => {
  const {
    tokennumber,
    name,
    email,
    password,
    password2,
    gender,
    address,
    age,
  } = req.body;
  const {
    imageUrl = "https://res.cloudinary.com/nazus/image/upload/v1587475204/cakut3nckczmbtfnhmsk.png",
  } = req.body; //for default image (unorthodox way)
  let errors = [];

  //check required fields
  if (
    !tokennumber ||
    !name ||
    !email ||
    !password ||
    !password2 ||
    !gender ||
    !address ||
    !age
  ) {
    errors.push({
      msg: "Please fill in all required fields",
    });
  }

  //check TokenNumber
  // if (
  //   answer.every(function (val) {
  //     return val == tokennumber;
  //   })
  // ) {
  //   errors.push({
  //     msg: "Invalid Registration Number",
  //   });
  //   //console.log(answer)
  // }

  //check password match
  if (password !== password2) {
    errors.push({
      msg: "Passwords do not match",
    });
  }

  //check pass length
  if (password.length < 6) {
    errors.push({
      msg: "Password length should be at least six characters",
    });
  }

  if (errors.length > 0) {
    res.render("register", {
      //suppose kunai condition meet garena bhane ni tei page ma basne bhayo
      errors,
      tokennumber, //register lai rendering garda errors lai pathairacha which is checked in messages
      name,
      email,
      password,
      password2,
      gender,
      address,
      age,
    });
  } else {
    //validation passed
    Patient.findOne({
      email: email,
    }).then((patient) => {
      if (patient) {
        // exists
        errors.push({
          msg: "Email is already registered",
        });
        res.render("register", {
          //if their is user re render the reg form and send error
          errors,
          tokennumber,
          name,
          email,
          password,
          password2,
          gender,
          address,
          age,
        });
      } else {
        //if there is new  user we have to create a user
        const newUser = new Patient({
          tokennumber,
          name, // name:name,
          email,
          password,
          gender,
          address,
          age,
          imageUrl,
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hash
            newUser.password = hash;
            //save user
            newUser
              .save()
              .then((patient) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                ); //calling flash msg after success
                res.redirect("/patient/login"); //localhst ma k path handa kata jane
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

//patient login handle

router.post(
  "/login",
  passport.authenticate("patient", {
    successRedirect: "/patientdashboard",
    failureRedirect: "/patient/login",
    failureFlash: true,
  })
);

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

// Search/view doctors

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/viewdoctors", ensureAuthenticated_patient, async (req, res) => {
  //Count doctors
  Doctor.find().exec(async function (err, results) {
    var doctorCount = results.length;
    const id = results._id;
    //Search
    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), "gi"); // g= global ; i=ignore case or smth
      await Doctor.find(
        { $or: [{ name: regex }, { speciality: regex }] },
        async function (err, doctors) {
          if (err) {
            throw err;
          } else {
            if (doctors.length < 1) {
              req.flash(
                "error_msg",
                "Sorry! Doctor not found,please try again"
              );
              res.redirect("/patient/viewdoctors");
            } else {
              res.render("viewdoctors", {
                doctorCount,
                doctors: doctors, //just doctors yo line ma incase --->const doctors
                user: req.user, //which is done above
              });
            }
          }
        }
      );
    } else {
      // To view all doctors
      const doctors = await Doctor.find({});
      res.render("viewdoctors", {
        doctorCount,
        doctors,
        user: req.user,
      });
    }
  });
});

//Currently Available doctors

router.get("/activeDoctors", ensureAuthenticated_patient, async (req, res) => {
  //To view current doctors
  const availability = await Availability.find(
    {},
    "doctorid doctorname days time speciality"
  );

  var isActive = false;
  var availDoc_daysFiltered = [];
  var availDocCount = [];
  var availDoc = [];
  for (let i in availability) {
    for (let j in availability[i].days) {
      if (availability[i].days[j] == moment().format("dddd")) {
        availDoc_daysFiltered.push(availability[i]);
        isActive = true;
      }
    }
  }
  var len = availDoc_daysFiltered.length;
  for (k = 0; k < len; k++) {
    let startTime = availDoc_daysFiltered[k].time.startTime;
    startTime = moment(startTime, ["h:mm A"]).format("HH:mm");
    let endTime = availDoc_daysFiltered[k].time.endTime;
    endTime = moment(endTime, ["h:mm A"]).format("HH:mm");
    let nowTime = moment().format("HH:mm");
    //   console.log("nowTime:" + nowTime);
    //   console.log("startTime:" + startTime);
    //   console.log("endTime:" + endTime);
    if (nowTime >= startTime && nowTime <= endTime)
      availDoc.push(availDoc_daysFiltered[k]);
    isActive = nowTime >= startTime && nowTime <= endTime;
  }
  availDocCount = availDoc.length;

  res.render("availableDoctors", {
    availDoc,
    availDocCount,
    user: req.user,
  });
});

//Doctors availability

router.get(
  "/doctorsAvailability",
  ensureAuthenticated_patient,
  async (req, res) => {
    //Count doctors
    Availability.find().exec(async function (err, results) {
      var doctorCount = results.length;
      const id = results._id;
      //Search
      if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), "gi"); // g= global ; i=ignore case or smth
        await Availability.find(
          {
            days: regex,
          },
          async function (err, doctors) {
            if (err) {
              throw err;
            } else {
              if (doctors.length < 1) {
                req.flash(
                  "error_msg",
                  `No doctors available at "${req.query.search}"`
                );
                res.redirect("/patient/doctorsAvailability");
              } else {
                res.render("doctorsTimeBasedList", {
                  doctorCount,
                  doctors: doctors, //just doctors yo line ma incase --->const doctors
                  user: req.user, //which is done above
                });
              }
            }
          }
        );
      } else {
        // To view all doctors
        const doctors = await Availability.find({});
        res.render("doctorsTimeBasedList", {
          doctorCount,
          doctors,
          user: req.user,
        });
      }
    });
  }
);

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

router.get("/:id", ensureAuthenticated_patient, async (req, res) => {
  res.render("doctordetails", {
    availability: req.availability,
    doctor: req.doctor,
    user: req.user,
  });
});

module.exports = router;
