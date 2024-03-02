require("dotenv").config();
const express = require("express");
const app = express();
const authrouter = require("./routes/auth");

app.use(express.json());
//routers
app.use("/api/v1/auth", authrouter);
//connectDB
const connectDB = require("./db/connect");

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`listening to port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
