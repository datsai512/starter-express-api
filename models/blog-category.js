/** @format */

const mongoose = require("mongoose");
const BlogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isHot: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blogCategory", BlogCategorySchema);
