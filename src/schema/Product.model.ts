import mongoose, { Schema } from "mongoose";
import {
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductTag,
  ProductVolume,
} from "../libs/enums/product.enum";

// DATABASE dagi qolib
const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },

    productCollection: {
      type: String,
      enum: ProductCollection,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    productNameKo: {
      type: String,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    productLeftCount: {
      type: Number,
      required: true,
    },

    productSize: {
      type: String,
      enum: ProductSize,
      default: ProductSize.NORMAL,
    },

    productVolume: {
      type: Number,
      enum: ProductVolume,
      default: ProductVolume.ONE,
    },

    productDesc: {
      type: String,
    },

    productDescKo: {
      type: String,
    },

    productTags: {
      type: [String],
      enum: ProductTag,
      default: [],
    },

    productSortOrder: {
      type: Number,
      default: 0,
    },

    productImages: {
      type: [String],
      default: [],
      required: true,
    },

    productViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }, // updatedAt, createdAt
);
productSchema.index(
  { productName: 1, productSize: 1, productVolume: 1 },
  { unique: true },
);

export default mongoose.model("Product", productSchema);
