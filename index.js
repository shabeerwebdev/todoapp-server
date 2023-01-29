const winston = require("winston");
const cors = require("cors");
const todos = require("./routes/todos");
const signUp = require("./routes/signUp");
const signIn = require("./routes/signIn");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");

winston.exceptions.handle(
  new winston.transports.Console({ colorize: true, prettyprint: true }),
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (error) => {
  throw error;
});

winston.add(new winston.transports.File({ filename: "logfile.log" }));

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("common"));
app.use(helmet());

app.use("/api/todos", todos);
app.use("/api/signup", signUp);
app.use("/api/signin", signIn);

app.get("/", (req, res) => {
  res.send("welcome to the todos api...");
});

const MONGO_URL = process.env.MONGO_URL;
const port = process.env.PORT || 8800;

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
