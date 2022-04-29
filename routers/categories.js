import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categories.js";

const router = express.Router();

router.route("/categories").get(getAllCategories).post(createCategory);

router.route("/categories/:id").delete(deleteCategory).put(updateCategory);

export default router;
