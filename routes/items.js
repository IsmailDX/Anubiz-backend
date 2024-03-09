const express = require("express");
const router = express.Router();

const { getAllItems } = require("../controllers/items");

router.route("/allItems").get(getAllItems);

module.exports = router;
