import mongoose, { Schema } from "mongoose";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";

// DATABASE dagi qolib
const memberSchema = new Schema(
  {
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },

    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },

    memberNick: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPhone: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPassword: {
      type: String,
      select: false,
      required: true,
    },

    memberAddress: {
      type: String,
    },

    memberDesc: {
      type: String,
    },

    memberImage: {
      type: String,
    },

    memberPoints: {
      type: Number,
      default: 0,
    },

    // Demo/portfolio payment method — never the full card number or CVV,
    // only what's needed to display a saved-card summary
    memberPayment: {
      cardBrand: { type: String },
      cardLast4: { type: String },
      cardHolder: { type: String },
      cardExpiry: { type: String },
    },
  },
  { timestamps: true }, // updatedAt, createdAt
);

export default mongoose.model("Member", memberSchema);
