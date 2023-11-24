/** @format */

const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    imgs: { type: [String], default: false },
    customerIdRef: {type: String, required: true},
    productIdRef: {type: String, required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("comments", CommentSchema);
