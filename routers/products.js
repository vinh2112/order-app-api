import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategoryId,
  updateProduct,
} from "../controllers/products.js";

const router = express.Router();

router.route("/products").get(getAllProducts).post(createProduct);

router.route("/products/:categoryId").get(getProductsByCategoryId);

router.route("/products/:id").delete(deleteProduct).put(updateProduct);

export default router;
