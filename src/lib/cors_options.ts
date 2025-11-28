import { Api_error } from "$/middleware/error.ts";
import { CorsOptions } from "cors";

const origins = process.env.CORS_ORIGINS?.split(",").map((o) => o.trim()) || [];

const cors_options: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (origins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Api_error("Not allowed by CORS", 404));
  },
  credentials: true,
  methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "User-Agent"],
};

export default cors_options;
