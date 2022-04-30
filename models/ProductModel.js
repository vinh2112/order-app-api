import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String,
    },
    image: [
      {
        type: String,
      },
    ],
    unit: {
      type: String,
    },
    prices: [
      {
        title: {
          type: String,
        },
        price: {
          type: Number,
          default: 0,
        },
      },
    ],
    quantity: {
      type: Number,
      default: 0,
    },
    isLinked: {
      type: Boolean,
      default: false,
    },
    linkedCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

var autoPopulate = function (next) {
  this.populate({
    path: "category",
  });
  next();
};

schema.pre("save", autoPopulate);

export const ProductModel = mongoose.model("Product", schema);
