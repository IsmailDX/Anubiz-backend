const express = require("express");
const router = express.Router();

const { getAllProducts } = require("../controllers/items");

router.route("/allProducts").get(getAllProducts);

module.exports = router;
