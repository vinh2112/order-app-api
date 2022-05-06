import { CategoryModel } from "../models/CategoryModel.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = new CategoryModel({ name });

    const savedCategory = await newCategory.save();

    return res.status(200).json(savedCategory);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await CategoryModel.findByIdAndDelete(id)
      .then(() => {
        return res.status(200).json({ isSuccess: true });
      })
      .catch((err) => {
        return res.status(500).json({ msg: err.message });
      });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const newCategory = await CategoryModel.findByIdAndUpdate(id, { name });
    return res.status(200).json(newCategory);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};
