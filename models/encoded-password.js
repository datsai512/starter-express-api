/** @format */

const mongoose = require("mongoose");
const EncodedPasswordSchema = new mongoose.Schema(
  {
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EncodedPassword", EncodedPasswordSchema);
