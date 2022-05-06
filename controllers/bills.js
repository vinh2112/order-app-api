import { BillModel } from "../models/BillModel.js";

export const createBill = async (req, res) => {
  try {
    const { userId, dishes } = req.body;

    const newBill = new BillModel({ userId, dishes });
    const savedBill = await newBill.save();

    return res.status(200).json(savedBill);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
