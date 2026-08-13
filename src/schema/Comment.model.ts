import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    commentText: {
      type: String,
      required: true,
    },

    commentRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },

    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
  },
  { timestamps: true }, // updatedAt, createdAt
);

commentSchema.index({ productId: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);
