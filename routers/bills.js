import express from "express";
import { createBill, getAllBills, getBillsByDate } from "../controllers/bills.js";

const router = express.Router();

router.route("/bills").get(getAllBills).post(createBill);
router.route("/bills/date").get(getBillsByDate);

export default router;
