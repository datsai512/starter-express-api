const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    gender: { type: String, default: "Other", enum: ["Men", "Women", "Other"] },
    birthDate: { type: Date },
    
    phoneNumber: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },

    email: { type: String, required: true },
    role: { type: String, default: "Customer", enum: ["Customer", "SuperAdmin", "Admin", "Employee"] },
    permission : {
        product: {
            view: { type: Boolean, default: true },
            detail: { type: Boolean, default: true },
            edit: { type: Boolean, default: false },
            add: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },

        user: {
            view: { type: Boolean, default: false },
            detail: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            add: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },

        log: {
            view: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            add: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },

        blog: {
            view: { type: Boolean, default: true },
            edit: { type: Boolean, default: false },
            add: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },

        category: {
            view: { type: Boolean, default: true },
            edit: { type: Boolean, default: false },
            add: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },

        order: {
            view: { type: Boolean, default: true },
            detail: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            add: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },

        blogCategory: {
            view: { type: Boolean, default: true },
            edit: { type: Boolean, default: false },
            add: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },

        imageBanner: {
            view: { type: Boolean, default: true },
            edit: { type: Boolean, default: false },
            add: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },
    },

    hasO2Auth: { type: Boolean, default: false},
    avatar: {type: String },
    orders: {type: [String]},
    gender: { type: String, default: "MALE", enum: ["MALE", "FEMALE", "OTHERS"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userss", UserSchema);
