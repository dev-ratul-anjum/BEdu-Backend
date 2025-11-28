import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import cors_options from "./lib/cors_options.ts";
import { global_error_handler, not_found_handler } from "./middleware/error.ts";
import app_router from "./router.ts";

const app = express();

app.use(cors(cors_options));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

app.use("/api", app_router);

app.use(not_found_handler);
app.use(global_error_handler);

export default app;
