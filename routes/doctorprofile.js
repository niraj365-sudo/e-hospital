const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const cloudinary = require("cloudinary");
const path = require("path");
const fs = require("fs");

require("../handlers/cloudinary");

const { ensureAuthenticated_doctor } = require("../config/auth");
const upload = require("../handlers/multer");
const Doctor = require("../models/Doctor");

// for extraction of data from different models
// const user_id = req. user._id;
// const patient = await Patient.findById(user_id);
// const profileimage = await Patient.find({"patientid" : patient._id})

//doctor profile page
router.get("/doctorprofile", ensureAuthenticated_doctor, async (req, res) => {
  res.render("doctorprofile", {
    user: req.user,
  });
});

// Upload profile photo
router.post(
  "/doctor/change_avatar",
  upload.single("image"),
  async (req, res) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const profile = await Doctor.findByIdAndUpdate({
      _id: req.user._id,
    });
    profile.imageUrl = result.secure_url;
    await profile.save();
    res.redirect("/doctorprofile");
  }
);

module.exports = router;
