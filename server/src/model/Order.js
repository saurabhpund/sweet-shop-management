const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        sweetId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sweet",
          required: true
        },
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["PLACED", "CANCELLED"],
      default: "PLACED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
