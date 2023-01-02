const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const cloudinary = require("cloudinary");
const path = require("path");
const fs = require("fs");

require("../handlers/cloudinary");

const { ensureAuthenticated_patient } = require("../config/auth");
const upload = require("../handlers/multer");
const Patient = mongoose.model("Patient");

// for extraction of data from different models
// const user_id = req. user._id;
// const patient = await Patient.findById(user_id);
// const profileimage = await Patient.find({"patientid" : patient._id})

//patient profile page
router.get("/patientprofile", ensureAuthenticated_patient, async (req, res) => {
  res.render("patientprofile", {
    user: req.user,
  });
});

// Upload profile photo
router.post(
  "/patient/change_avatar",
  upload.single("image"),
  async (req, res) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const profile = await Patient.findByIdAndUpdate({
      _id: req.user._id,
    });
    profile.imageUrl = result.secure_url;
    await profile.save();
    res.redirect("/patientprofile");
  }
);

module.exports = router;
