/** @format */

const mongoose = require("mongoose");
const BlogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    name2: { type: String, required: true },
    categoryBlogRef: { type: String, required: true },
    slug: { type: String, required: true },
    isHotNew: { type: Boolean, required: false },
    datePublish: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blogCategory", BlogCategorySchema);
