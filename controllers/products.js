import { ProductModel } from "../models/ProductModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const foods = await ProductModel.find();

    return res.status(200).json(foods);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, categoryId, image, description, price, quantity } = req.body;

    const newProduct = new ProductModel({
      title,
      category: categoryId,
      image,
      description,
      price,
      quantity,
    });

    const savedProduct = await newProduct.save();

    return res.status(200).json(savedProduct);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await ProductModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });

    return res.status(200).json({ isSuccess: true });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, categoryId, image, description, price, quantity } = req.body;

    await ProductModel.findByIdAndUpdate(
      id,
      {
        title,
        category: categoryId,
        image,
        description,
        price,
        quantity,
      },
      { new: true }
    );

    return res.status(200).json({ isSuccess: true });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};
