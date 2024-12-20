import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
      unique: true,
    },
    shortDesc: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    slots_booked: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
  { minimze: false }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
