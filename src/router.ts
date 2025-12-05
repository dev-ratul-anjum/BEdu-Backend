import { Router } from "express";
import api_response from "./middleware/api_response.js";
import user_router from "./modules/user/user.router.js";
import notice_router from "./modules/notice/notice.router.js";
// import routine_router from "./modules/routine/routine.routes.js";

const app_router = Router({ caseSensitive: true });

app_router.all("/health-check", async (_req, res) => {
  return api_response(res, 200, {
    success: true,
    message: "OK! Server is in good health",
  });
});

app_router.use("/user", user_router);
app_router.use("/noticeboard", notice_router);
// app_router.use("/routine", routine_router);

export default app_router;
