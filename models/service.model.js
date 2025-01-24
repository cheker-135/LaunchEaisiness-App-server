import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: true,
    },
    manager: {
      type: String,
    },
    certificate_number: {
      type: String,
    },
    siege_social: { type: String },
    registre_commerce: { type: String },
    matricule_fiscale: { type: String },
    forme_juridique: { type: String },
    capitale_social: { type: Number },
    participation_etrangere: { type: Boolean },
    participation_locale: [
      {
        country: { type: String },
        percentage: { type: Number },
      },
    ],
    num_cnss: { type: String },
    tel: { type: String },
    fax: { type: String },
    email: { type: String },
    image: {
      path: { type: String },
      date: { type: Date },
    },
    validated: {
      type: Boolean,

      default: false,
    },
    files: [
      {
        path: { type: String },
        date: { type: Date },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);
