import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    default: "",
    maxlength: 500,
  },
});

// เก็บหมวดหมู่
const menuCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["Menu", "Special Menu"], 
    unique: true,                   
  },

  items: {
    type: [menuItemSchema],
    default: [],
  },
});

const MenuCategory = mongoose.model("MenuCategory", menuCategorySchema);

export default MenuCategory;


