import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    // table: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Table",
    // },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dishes: [
      {
        dish: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        subDish: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        ],
        size: {
          type: String,
        },
        totalPrice: {
          type: Number,
          default: 0,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        note: {
          type: String,
        },
      },
    ],
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: 1, // 0: on progress - 1: paid
    },
    type: {
      type: Boolean,
      default: 0, // 0: takeaway - 1: tại chỗ
    },
  },
  { timestamps: true }
);

export const BillModel = mongoose.model("Bill", schema);
