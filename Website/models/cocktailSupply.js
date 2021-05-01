const mongoose = require("mongoose");

const supplySchema = new mongoose.Schema({
  cocktail: {
    type: String,
    required: true,
  },
  supplyLeft: {
    type: Number,
    required: true,
  },
  pricePer250ml: {
    type: Number,
    required: true,
  },
  redBlinks: {
    type: Number,
    required: true,
  },
  greenBlinks: {
    type: Number,
    required: true,
  },
  blueBlinks: {
    type: Number,
    required: true,
  },
});

const Supply = mongoose.model("Supply", supplySchema);

module.exports = Supply;
