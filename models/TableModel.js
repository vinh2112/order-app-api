import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    dishes: [
      {
        dish: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        ],
        amount: {
          type: Number,
          default: 1,
        },
      },
    ],
    status: {
      type: Number,
      default: 0, // 0: empty - 1: serving - 2: reserved - 3: under repair
    },
  },
  { timestamps: true }
);

export const TableModel = mongoose.model("Table", schema);
