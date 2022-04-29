import express from "express";
import { createTable, getAllTables, handlePay, updateTable } from "../controllers/tables.js";

const router = express.Router();

router.route("/tables").get(getAllTables).post(createTable);

router.route("/tables/:id").put(updateTable);

router.route("/tables/:id/pay").put(handlePay);

export default router;
