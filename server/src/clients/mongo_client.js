/**
 * This file handles the MongoDB connection using Mongoose.
 *
 * The `connectDB` function attempts to establish a connection to the MongoDB database.
 * If the connection fails, it retries up to 3 times with an increasing delay between each attempt.
 * The database URI is taken from the environment variable `MONGODB_URI`, and the database name is imported from `constants.js`.
 */

import mongoose from "mongoose";

let retries = 3;
let retryDuration = 2000;

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );

    console.log(
      `\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error: ", error.message);
    if (--retries === 0) {
      console.log("No more retries left, exiting...");
      process.exit(1);
    }
    console.log(`Reconnecting in ${retryDuration / 1000} seconds...`);
    retryDuration *= 2;
    setTimeout(connectDB, retryDuration);
  }
};

export function getDb() {
  return mongoose.connection.db;
}

export default connectDB;
