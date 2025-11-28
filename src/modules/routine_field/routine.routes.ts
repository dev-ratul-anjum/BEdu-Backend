import { Router } from "express";
import routine_controller from "./routine.controller.ts";

const routine_router = Router();

routine_router.post("/create", routine_controller.create);

routine_router.get("/list", routine_controller.list);

routine_router.put("/update/:id", routine_controller.update);

routine_router.delete("/delete/:id", routine_controller.delete);

routine_router.get(
  "/by-class-academic-year",
  routine_controller.getBy_class_academic_year
);

routine_router.get(
  "/by-teacher-academic-year",
  routine_controller.getBy_teacher_academic_year
);

export default routine_router;
