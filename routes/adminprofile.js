const express = require("express");
const router = express.Router();
require("dotenv").config();
const cloudinary = require("cloudinary");
require("../handlers/cloudinary");

const { ensureAuthenticated_admin } = require("../config/auth");
const upload = require("../handlers/multer");
const Admin = require("../models/Admin");

//doctor profile page
router.get("/adminprofile", ensureAuthenticated_admin, async (req, res) => {
  res.render("adminprofile", {
    user: req.user,
  });
});

// Upload profile photo
router.post(
  "/admin/change_avatar",
  upload.single("image"),
  async (req, res) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const profile = await Admin.findByIdAndUpdate({
      _id: req.user._id,
    });
    profile.imageUrl = result.secure_url;
    await profile.save();
    res.redirect("/adminprofile");
  }
);

module.exports = router;
