import { Router } from "express";
import api_response from "./middleware/api_response.js";
import user_router from "./modules/user/user.router.js";
import notice_router from "./modules/notice/notice.router.js";
import academic_year_router from "./modules/academics/academic_year/academic_year.router.js";
import class_router from "./modules/academics/class/class.router.js";
import section_router from "./modules/academics/section/section.router.js";
import subject_router from "./modules/academics/subject/subject.router.js";
import routine_entry_router from "./modules/routine_entry/routine_entry.routes.js";
import biometric_device_router from "./modules/biometric/biometric_device/biometric_device.router.js";
import biometric_user_router from "./modules/biometric/biometric_user/biometric_user.router.js";
import attendance_router from "./modules/biometric/attendance/attendance.router.js";
import student_router from "./modules/user/student/student.router.js";

const app_router = Router({ caseSensitive: true });

app_router.all("/health-check", async (_req, res) => {
  return api_response(res, 200, {
    success: true,
    message: "OK! Server is in good health",
  });
});

app_router.use("/user", user_router);
app_router.use("/student", student_router);
app_router.use("/notice", notice_router);
app_router.use("/routine-entry", routine_entry_router);
app_router.use("/academic-year", academic_year_router);
app_router.use("/class", class_router);
app_router.use("/section", section_router);
app_router.use("/subject", subject_router);

// Biometric
app_router.use("/biometric-device", biometric_device_router);
app_router.use("/biometric-user", biometric_user_router);
app_router.use("/biometric-attendance", attendance_router);

export default app_router;
