import { Router } from "express";
import api_response from "./middleware/api_response.ts";
import user_router from "./modules/user/user.router.ts";
import noticeboard_router from "./modules/noticeboard/noticeboard.router.ts";

const app_router = Router({ caseSensitive: true });

app_router.all("/health-check", async (_req, res) => {
  return api_response(res, 200, {
    success: true,
    message: "OK! Server is in good health",
  });
});

app_router.use("/user", user_router);
app_router.use("/noticeboard", noticeboard_router);

export default app_router;
