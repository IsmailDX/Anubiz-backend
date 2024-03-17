const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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
  category: {
    type: String,
    enum: {
      values: ["electronics", "clothing", "home", "fitness", "toys"],
      message: "{VALUE} is not supported",
    },
  },
  section: {
    type: String,
    required: [true, "Product section must be provided"],
  },
});

module.exports = mongoose.model("Product", productSchema);
