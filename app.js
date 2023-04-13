var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
const passport = require("passport");
const PassportLocal = require("passport-local").Strategy;
var favicon = require("serve-favicon");
var flash = require("connect-flash");
//model
const User = require("./models/user_model");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(
  session({
    secret: "ostriches will rule the world",
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: false,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(flash());

app.use(function (req, res, next) {
  if (!req.user)
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new PassportLocal(function (username, password, done) {
    User.getUser([username, password]).then((result) => {
      if (result.length > 0) {
        return done(null, {
          id: result[0].USERID,
          email: result[0].EMAIL,
          name: result[0].NOMBRE,
        });
      }
      done(null, false, { message: "Usuario y/o contraseña incorrectos" });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById([id]).then((user) => {
    done(null, user[0]);
  });
  // done(null, { id: id, name: "asd" });
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(function (req, res, next) {
  console.log(req.isAuthenticated());
  if (!req.isAuthenticated()) {
    res.redirect("/");
  }
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
