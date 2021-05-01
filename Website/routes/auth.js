const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const AuthController = require("../controllers/AuthController");
const Order = require("../models/orders.js");
const Supply = require("../models/cocktailSupply");
const { registerPartial } = require("hbs");

router.use(cookieParser());
router.use(express.json())

router.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

router.post("/register", AuthController.register);

router.post("/", AuthController.login);

router.get("/products", AuthController.authenticateToken, (req, res) => {
    res.render("products", {});
});

router.get("/dashboard", AuthController.authenticateToken, (req, res) => {
    res.render("dashboard", {});
});

router.get("/earnings", AuthController.authenticateToken, (req, res) => {
    res.render("earnings", {});
});

router.get("/signout", AuthController.clearCookies, (req, res) => {
  res.render("settings", {});
});

// Order.watch().on("change", (change) => {
//   console.log("works");
// });

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(302).send(orders);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/supply", async (req, res) => {
  try {
    const currentSupply = await Supply.find({});
    res.status(302).send(currentSupply);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    newOrder.save();
    res.status(201).send(newOrder);
  } catch (e) {
    return res.send(500).send(e);
  }
});

router.post("/supply", async (req, res) => {
  try {
    const newSupply = new Supply(req.body);
    newSupply.save();
    res.status(201).send(newSupply);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.put("/supply", async (req, res) => {
  try {
    const oldCocktailName = req.body.oldCocktailName;

    delete req.body.oldCocktailName;

    const updatedSupply = req.body;
    const updated = await Supply.updateOne(
      { cocktail: oldCocktailName },
      updatedSupply
    );
    res.send(updated);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.delete("/supply", (req, res) =>{
  Supply.deleteOne(req.body, function(error) {
    if(error) {
      console.log("error", error)
    }
    
  })
  console.log(req.body)
  res.status(201).send(req.body);
})


module.exports = router;
