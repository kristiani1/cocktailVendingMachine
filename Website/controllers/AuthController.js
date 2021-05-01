const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { access } = require("fs");

const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    let user = new User({
      username: req.body.username,
      password: hashedPass,
    });
    user
      .save()
      .then((user) => {
        res.json({
          message: "User created",
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          message: "error",
        });
      });
  });
};

const login = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ username: username }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        // tunnukset oikein
        if (result) {
          const authToken = jwt.sign({ username: user.username }, "aZfa2@");
          res.cookie("auth_token", authToken);
          res.redirect("dashboard");
        } else {
          res.render("index", {
            data: "password invalid",
            passWrong: "password",
          });
        }
      });
    } else {
      res.render("index", {
        data: "Username not found",
        userWrong: "username",
      });
    }
  });
};

const authenticateToken = (req, res, next) => {
  if (req.cookies.auth_token) {
    next();
  } else {
    res.redirect("/");
  }
};

const clearCookies = (req, res, next) => {
  res.clearCookie("auth_token");
  next();
} 

module.exports = {
  register,
  login,
  authenticateToken,
  clearCookies
};
