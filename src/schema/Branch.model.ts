// src/schema/Branch.model.ts
import mongoose, { Schema } from "mongoose";
import { BranchName, BranchStatus } from "../libs/enums/branch.enum";

const branchSchema = new Schema(
  {
    branchName: {
      type: String,
      enum: BranchName,
      required: true,
    },

    branchStatus: {
      type: String,
      enum: BranchStatus,
      default: BranchStatus.OPEN,
    },

    branchAddress: {
      type: String,
      required: true,
    },

    branchPhone: {
      type: String,
      required: true,
    },

    branchDesc: {
      type: String,
    },

    branchImage: {
      type: String,
    },

    branchMapUrl: {
      type: String,
    },

    // ✅ YANGI FIELDLAR
    branchHours: {
      type: String,
      default: "11:00 - 22:00",
    },

    branchRating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },

    branchStaffCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

branchSchema.index({ branchName: 1 }, { unique: true });

export default mongoose.model("Branch", branchSchema);
