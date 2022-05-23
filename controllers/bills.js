import { BillModel } from "../models/BillModel.js";

export const getAllBills = async (req, res) => {
  try {
    const bills = await BillModel.find()
      .populate({ path: "user", select: "-password" })
      .populate({ path: "dishes.dish" })
      .populate({ path: "dishes.subDish" });

    return res.status(200).json(bills);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const createBill = async (req, res) => {
  try {
    const { user, dishes } = req.body;
    const totalPrice = dishes.reduce((total, curr) => (total += curr.totalPrice), 0);

    const newBill = new BillModel({ user, dishes, total: totalPrice });
    const savedBill = await newBill.save();

    await BillModel.populate(savedBill, [
      { path: "user", select: "-password" },
      { path: "dishes.dish" },
      { path: "dishes.subDish" },
    ]);

    return res.status(200).json(savedBill);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getBillsByDate = async (req, res) => {
  try {
    const { t, type } = req.query;
    const { start, end } = getStartAndEndTimeStamp(t, type);

    const bills = await BillModel.find({ createdAt: { $gt: start, $lt: end } });

    await BillModel.populate(bills, [
      { path: "user", select: "-password" },
      { path: "dishes.dish" },
      { path: "dishes.subDish" },
    ]);

    return res.json(bills);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getStartAndEndTimeStamp = (t, type) => {
  let start, end;

  if (type === "year") {
    let yearOfTimeStamp = new Date(t * 1000).getFullYear();

    start = new Date(
      new Date(new Date().setUTCFullYear(yearOfTimeStamp, 0, 1)).setUTCHours(0, 0, 0)
    ).toISOString();
    end = new Date(
      new Date(new Date().setUTCFullYear(yearOfTimeStamp, 11, 31)).setUTCHours(23, 59, 59)
    ).toISOString();
  } else if (type === "month") {
    let monthOfTimeStamp = new Date(t * 1000).getMonth();

    start = new Date(
      new Date(new Date().setUTCMonth(monthOfTimeStamp, 1)).setUTCHours(0, 0, 0)
    ).toISOString();
    end = new Date(
      new Date(new Date().setUTCMonth(monthOfTimeStamp + 1, 0)).setUTCHours(23, 59, 59)
    ).toISOString();
  } else {
    start = new Date(new Date(t * 1000).setUTCHours(0, 0, 0)).toISOString();
    end = new Date(new Date(t * 1000).setUTCHours(23, 59, 59)).toISOString();
  }

  return { start, end };
};
