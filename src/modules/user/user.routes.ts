import express from "express";
import userController from "./user.controller.ts";
import { requireAuth } from "$/middleware/auth.ts";
import { authorizeRoles } from "$/utils/authorizeRoles.ts";

const userRouter = express.Router();

userRouter.post(
  "/register",
  requireAuth,
  authorizeRoles("ADMIN"),
  userController.register
);
userRouter.post("/login", userController.login);
userRouter.get("/profile", requireAuth, (req, res) => {
  res.json({ message: "Profile Page" });
});

export default userRouter;
