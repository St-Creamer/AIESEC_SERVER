const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PostRoute = require("./Routes/PostRoute");
const UserRoute = require("./Routes/UserRoute")
require("dotenv").config();

//MongoDB connection
//change <appname> to a new mongo database
mongoose.connect("mongodb://localhost/aiesec", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

//Middleware
app.use(express.json());
app.use("/api/post", PostRoute);
app.use("/api/user", UserRoute);

//Once db connects start server
db.on("error", console.error.bind(console, "db conneciton error"));
db.once("open", () => {
  console.log("db connected");

  app.get("/", (req, res) => {
    res.send("<h1>Welcome to your server</h1>");
  });

  app.listen(process.env.SERVER_PORT , () => {
    console.log(`server listening on port ${process.env.SERVER_PORT}`);
  });
});
