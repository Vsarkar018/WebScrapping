const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDb = async () => {
  const DB_URL = process.env.MONGO_URI;
  try {
    await mongoose.connect(DB_URL);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
