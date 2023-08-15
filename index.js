require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const connectDb = require("./utils/ConnectDb.Js");
const ScrappingRouter = require("./Gateway/ScrappingAPI");
const UserRouter = require("./Gateway/UserAPI");
app.use("/user", UserRouter);
app.use("/", ScrappingRouter);
connectDb()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.use("/", (req, res) => {
  res.send("API is running");
});

const port = 5000;
app.listen(port, () =>
  console.log(`Server is listenting on the port ${port}...`)
);
