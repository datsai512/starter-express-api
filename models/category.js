/** @format */

const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isHot: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("categorys", CategorySchema);
