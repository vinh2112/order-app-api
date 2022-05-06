import express from "express";
import { createBill } from "../controllers/bills.js";

const router = express.Router();

router.route("/bills").post(createBill);

export default router;
