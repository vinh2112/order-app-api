import { BillModel } from "../models/BillModel.js";
import { ProductModel } from "../models/ProductModel.js";
import { TableModel } from "../models/TableModel.js";

export const getAllTables = async (req, res) => {
  try {
    const tables = await TableModel.find();

    return res.status(200).json(tables);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const createTable = async (req, res) => {
  try {
    const { title } = req.body;

    const newTable = new TableModel({ title });

    const savedTable = await newTable.save();

    return res.status(200).json(savedTable);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, dishes } = req.body;

    if (dishes) {
      // Update dishes on serving table
      const table = await TableModel.findById(id);

      //handle quantity of food
      dishes.forEach(async (dish) => {
        {
          await ProductModel.findByIdAndUpdate(dish.dish, { $inc: { quantity: -dish.amount } });
        }
      });

      // handle table's dishes
      let newDishes = [...table.dishes, ...dishes];
      newDishes = await removeDuplicateDishes(newDishes);

      // Update table here
      const savedTable = await TableModel.findByIdAndUpdate(
        id,
        {
          $set: { dishes: newDishes, status: 1 },
        },
        { new: true }
      ).populate({
        path: "dishes.dish",
      });
      return res.status(200).json(savedTable);
    } else {
      // Update Table's name
      await TableModel.findByIdAndUpdate(id, { title }, { new: true })
        .then(() => {
          return res.status(200).json({ isSuccess: true });
        })
        .catch((err) => {
          return res.status(500).json({ msg: err.message });
        });
    }
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const handlePay = async (req, res) => {
  try {
    let total = 0;
    const table = await TableModel.findById(req.params.id).populate("dishes.dish");

    let dishes = table.dishes.map((dish) => {
      let newDish = {
        dish: dish.dish._id,
        amount: dish.amount,
      };

      total += dish.dish.price * dish.amount;

      return newDish;
    });

    const newBill = new BillModel({
      table: table._id,
      dishes,
      total,
      //user here
    });

    return res.status(200).json(dishes);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

async function removeDuplicateDishes(inArray) {
  var arr = inArray.concat();
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i].dish.toString() === arr[j].dish) {
        await ProductModel.findByIdAndUpdate(arr[i].dish.toString(), {
          $inc: { quantity: arr[i].amount },
        });
        arr[i].amount = arr[j].amount;
        arr.splice(j, 1);
        if (arr[i].amount === 0) {
          arr.splice(i, 1);
        }
      }
    }
  }
  return arr;
}
