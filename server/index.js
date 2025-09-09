// index.js (or main.js)

import dotenv from "dotenv";
import { server } from "./server.js";
import connectDB from "./src/clients/mongo_client.js";
import { configSockt } from "./src/sockets/socket_client.js";

dotenv.config();

const PORT = process.env.PORT || 3000;


async function startServer() {
  try {

      configSockt(server)
    await connectDB();
    console.log(" MongoDB connected successfully");

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });


    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
     process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception thrown:", err);
      shutdown();
    });

  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

async function shutdown() {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
}

startServer();
