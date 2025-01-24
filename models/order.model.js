import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Pending", "Rejected", "Done"],
      required: true,
      default: "Pending",
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
