const http = require("http");
const express = require("express");
const expresslayouts = require("express-ejs-layouts");
const nocache = require("nocache");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const bodyparser = require("body-parser");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const MongoStore = require('connect-mongo');
const server = http.createServer(app);
const dotenv = require("dotenv");
dotenv.config();

app.use("/public/images/", express.static("./public/images"));

//passport config
require("./config/passport");

//dbcongif
// const db = require("./config/keys").MongoURI;

//connect to mongo

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDb connected.."))
  .catch((err) => console.log(err));

//ejs
app.use(expresslayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//nocache middleware
app.use(nocache());

//method override //upload pati ko
app.use(methodOverride("_method"));

//bodyparser // yedi registration ma length ko error ayo bhane dekhi yo unmark garne
app.use(
  express.urlencoded({
    extended: true,
  })
);

//bodyparsser
// app.use(bodyparser.urlencoded({ extended: false }));
//No bodyparser needed
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//exp session
//express-session middleware
//we can search from express session github

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      clientPromise:false,
      mongoUrl: process.env.MONGO_URI,
      ttl: 1 * 24 * 60 * 60 // save session for 1 days
  }),
  cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 1// expires in 1 days
  }
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//call routes

app.use("/", require("./routes/index"));
app.use("/patient", require("./routes/patient"));
app.use("/doctor", require("./routes/doctor"));
app.use("/admin", require("./routes/admin"));
app.use("/", require("./routes/reports"));
app.use("/", require("./routes/doctorprofile"));
app.use("/", require("./routes/patientprofile"));
app.use("/", require("./routes/adminprofile"));
app.use("/", require("./routes/admincontrols"));
app.use("/", require("./routes/doctorcontrols"));
app.use("/", require("./routes/appointment"));
app.use("/", require("./routes/api/feedback"));

const PORT = process.env.PORT || 3000;

server.listen(PORT, console.log(`Server started on port ${PORT}`));
