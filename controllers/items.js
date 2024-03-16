const { StatusCodes } = require("http-status-codes");
const Products = require("../models/product");

const getAllProducts = async (req, res) => {
  let name = req.user.name;
  const products = await Products.find({});
  res.status(StatusCodes.OK).json({ user: { name: name }, products });
};

module.exports = { getAllProducts };
