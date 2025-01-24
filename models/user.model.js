import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Picture",
    },

    PDF: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PDF",
    },
    nationality: {
      type: String,
    },
    foreign_resident: {
      type: Boolean,
    },
    residence_country: {
      type: String,
    },
    civility: {
      type: String,
    },
    birth_date: {
      type: Date,
    },
    birth_place: {
      type: String,
    },
    level_education: {
      type: String,
    },
    diplome: {
      type: String,
    },
    quality: {
      type: String,
      enum: ["Promoteur", "Gérant", "Mandataire"],
    },
    identity_type: {
      type: String,
      enum: ["CIN", "Passport"],
    },
    cin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Picture",
    },
    passport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Picture",
    },
    issue_date: {
      type: Date,
    },
    issue_place: {
      type: String,
    },
    address: {
      type: String,
    },
    ville: {
      type: String,
    },
    code_postal: {
      type: String,
    },
    tel: {
      type: String,
    },
    fax: {
      type: String,
    },

    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
