import mongoose from "mongoose";
let isConnected = false;

const ConnctDB = async () => {
  const mongoUrl = process.env.MONGO_URL as string;

  if (!mongoUrl) {
    throw new Error("MONGO_URL is not defined");
  }
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("Mongo DB is Alrady Connected");
    return;
  }
  try {
    const connection = await mongoose.connect(mongoUrl);
    isConnected = true;

    console.log("MongoDB Connected ");
  } catch (error) {
    console.log("DB CONNECTION ERR!!");
  }
};

export default ConnctDB;
