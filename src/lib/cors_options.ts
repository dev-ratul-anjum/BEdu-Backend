import { Api_error } from "$/middleware/error_handler.js";
import { CorsOptions } from "cors";

const origins = process.env.CORS_ORIGINS?.split(",").map((o) => o.trim()) || [];

const cors_options: CorsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "User-Agent"],
};

export default cors_options;
