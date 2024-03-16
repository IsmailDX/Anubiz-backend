const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name must be provided"],
  },
  price: {
    type: Number,
    required: [true, "Product price must be provided"],
  },
  priceBefore: {
    type: Number,
  },
  discount: {
    type: Boolean,
    default: false,
  },
  discountPercentage: {
    type: Number,
  },
  image: {
    type: [String],
    required: [true, "Product image must be provided"],
  },
});

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category must be provided"],
  },
  items: {
    type: [itemSchema],
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  electronics: {
    type: [categorySchema],
  },
  clothing: {
    type: [categorySchema],
  },
  fitness: {
    type: [categorySchema],
  },
  toys: {
    type: [categorySchema],
  },
});

module.exports = mongoose.model("Product", productSchema);
