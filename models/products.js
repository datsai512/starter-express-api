
const mongoose = require("mongoose");
const ProductsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },

    categoryRefIds: {type: [String]},

    price: { type: Number, required: true },
    discountPrice: { type: Number },

    dateDiscount: { type: Date },
    isSale: { type: Boolean, default: false},
    isHot: { type: Boolean, default: false},
    description: {type: String},
    imgs: {type: [String]},

    colors: [
        {
            color: {type: String},
            imgs: {type: [String]},
            sizes: [
                {
                    price: {type: Number, required: true},
                    discountPrice: {type: Number},
                    isSale: {type: Boolean, default: false},
                    isHot: {type: Boolean, default: false},
                    dateDiscount: { type: Date },
                    size: {type: String, required: true}
                }
            ]
        }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", ProductsSchema);
