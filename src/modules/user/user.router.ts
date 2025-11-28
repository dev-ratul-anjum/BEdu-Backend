import require_auth from "$/middleware/auth.ts";
import { authorize_roles } from "$/utils/authorize_roles.ts";
import { Router } from "express";
import user_controller from "./user.controller.ts";

const user_router = Router();

user_router.post(
  "/register",
  require_auth,
  authorize_roles("ADMIN"),
  user_controller.register
);
user_router.post("/login", user_controller.login);
user_router.get("/profile", require_auth, (req, res) => {
  res.json({ message: "Profile Page" });
});

export default user_router;
