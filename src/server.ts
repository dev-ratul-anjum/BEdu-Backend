import "dotenv/config";
import app from "./app.js";
import { Server } from "http";
import { db } from "./db/index.js";
import seed_super_admin from "./utils/seed_super_admin.js";

const PORT = process.env.PORT;

let server: Server;

// Start the server
const start_server = async () => {
  try {
    await db.$connect();
    console.log("Database connected successfully!");

    await seed_super_admin();

    server = app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.log(`Failed to start the server :`, error.message);
    process.exit(1);
  }
};
start_server();

// Handle Server Errors
const shut_down = (message: string) => {
  console.error(message);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
};

process.on("unhandledRejection", () => {
  shut_down("Unhandled Promise Rejection occurred");
});

process.on("uncaughtException", (err) => {
  shut_down(`Uncaught Exception occurred : ${err.message}`);
});

process.on("SIGTERM", () => {
  shut_down("SIGTERM received. Server is shutting down gracefully...");
});

process.on("SIGINT", () => {
  shut_down("SIGINT received. Server is shutting down gracefully...");
});
