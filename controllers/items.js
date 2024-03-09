const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const getAllItems = async (req, res) => {
  const user = req.user.name;
  res.status(StatusCodes.OK).json({ username: user, message: "Hello there" });
};

module.exports = { getAllItems };
