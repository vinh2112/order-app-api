import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dishes: [
      {
        dish: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        ],
        price: {
          type: Number,
          default: 0,
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
