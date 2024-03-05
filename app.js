require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const authrouter = require("./routes/auth");

//security
const cors = require("cors");

app.use(cors());
app.use(express.json());

//routers
app.use("/api/v1/auth", authrouter);

// error handler
const errorHandlerMiddleware = require("./middlewares/error-handler");
app.use(errorHandlerMiddleware);

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
