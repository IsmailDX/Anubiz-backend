const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const getAllItems = async (req, res) => {
  let name = req.user.name;
  res.status(StatusCodes.OK).json({ user: { name: name } });
};

module.exports = { getAllItems };
