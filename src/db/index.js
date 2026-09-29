import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
  path: "././.env",
});
const connectDb = async () => {
  try {
    const DBURL = process.env.MONGO_URL;
    if (DBURL) {
      await mongoose.connect(DBURL);
      console.log("DB is connected");
    }
  } catch (error) {
    console.log("DB connection is faield", error);
    process.exit(1);
  }
};

export default connectDb;
