module.exports = {

  //For Patient

  ensureAuthenticated_patient: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource of patient panel');
    res.redirect('/patient/login');
  },

  //For Doctor

  ensureAuthenticated_doctor: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource of doctor panel');
    res.redirect('/doctor/Dlogin');
  },

  //For admin

  ensureAuthenticated_admin: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource of admin panel');
    res.redirect('/admin/adminlogin');
  }
}