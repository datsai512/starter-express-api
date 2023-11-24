/** @format */

const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    listProduct: [
      {
        productId: {type: String, require: true},
        color: {type: String, require: true},
        size: {type: String, require: true},
        price: {type: Number, require: true},
      }
    ], 
    totalPrice: { type: Number },
    customerId: { type: String, require: true },
    status:  { type: String, default: "New", enum: ["New", "Process", "Shipping", "Done"] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", OrderSchema);
