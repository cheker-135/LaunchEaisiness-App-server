import mongoose from "mongoose";

const pictureSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  },
  { timestamps: true }
);

export const Picture = mongoose.model("Picture", pictureSchema);
