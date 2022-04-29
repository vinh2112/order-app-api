import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/products.js";

const router = express.Router();

router.route("/products").get(getAllProducts).post(createProduct);

router.route("/products/:id").delete(deleteProduct).put(updateProduct);

export default router;
