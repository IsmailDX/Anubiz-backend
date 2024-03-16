require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");

const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    //remove all products
    await Product.deleteMany();
    await Product.create(jsonProducts);
    console.log("items in db!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};
start();
