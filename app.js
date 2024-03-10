require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

//routers
const authrouter = require("./routes/auth");
const itemsrouter = require("./routes/items");

//session
const session = require("express-session");
const MongoStore = require("connect-mongo");

//google authentication
const passport = require("passport");
require("./config/passport-setup")(passport);

//security
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

//middleware
const errorHandlerMiddleware = require("./middlewares/error-handler");
app.use(errorHandlerMiddleware);
const authGoogle = require("./middlewares/authGoogle");

//connectDB
const connectDB = require("./db/connect");

//google
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

//routers
app.use("/auth", authrouter);
app.use("/home", authGoogle, itemsrouter);

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
