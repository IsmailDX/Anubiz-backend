require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const authrouter = require("./routes/auth");
const session = require("express-session");
const passport = require("passport");

// Passport config
require("./config/passport-setup")(passport);

//security
const cors = require("cors");

app.use(cors());
app.use(express.json());

// error handler
const errorHandlerMiddleware = require("./middlewares/error-handler");
app.use(errorHandlerMiddleware);

//connectDB
const connectDB = require("./db/connect");

//google
app.use(
  session({
    secret: "Ultimate secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//routers
app.use("/auth", authrouter);

app.get("/", (req, res) => {
  res.send("Hello there!");
});

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
