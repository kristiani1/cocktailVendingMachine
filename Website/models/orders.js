const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  cocktail: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  pricePerDrink: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
