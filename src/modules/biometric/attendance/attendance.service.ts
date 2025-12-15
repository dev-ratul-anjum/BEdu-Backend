import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import {
  TCreate_attendance_raw_schema,
  TUpdate_attendance_daily_schema,
} from "./attendance.schema.js";
import {
  LATE_PRESENT_ENABLED,
  MAX_CUMULATIVE_COUNT,
  SLOT_CONFIG,
  to_minutes,
} from "./attendance.utils.js";

const create_attendance = async (data: TCreate_attendance_raw_schema) => {
  const punch_hm = data.timestamp.getHours() * 60 + data.timestamp.getMinutes();

  let slot: "morning" | "noon";
  let is_late = false;

  if (
    punch_hm >= to_minutes(SLOT_CONFIG.morning.start) &&
    punch_hm <= to_minutes(SLOT_CONFIG.morning.late_end)
  ) {
    slot = "morning";
    is_late = punch_hm > to_minutes(SLOT_CONFIG.morning.end);
  } else if (
    punch_hm >= to_minutes(SLOT_CONFIG.noon.start) &&
    punch_hm <= to_minutes(SLOT_CONFIG.noon.late_end)
  ) {
    slot = "noon";
    is_late = punch_hm > to_minutes(SLOT_CONFIG.noon.end);
  } else {
    throw new Api_error("Outside attendance slot. Ignored.", 200);
  }

  return await db.$transaction(async (tx) => {
    // ---------- DEVICE USER ----------
    const device_user = await tx.biometricUser.findUnique({
      where: { id: data.device_user_id },
    });

    if (!device_user) {
      throw new Api_error("Requested biometric user does not exist", 404);
    }

    const todayDate = new Date(data.timestamp.toDateString());

    // ---------- DAILY ----------
    const daily = await tx.attendanceDaily.findUnique({
      where: {
        user_id_date: {
          user_id: device_user.user_id,
          date: todayDate,
        },
      },
    });

    // ---------- DUPLICATE CHECK ----------
    if (daily) {
      const current_slot_status =
        slot === "morning" ? daily.morning_status : daily.noon_status;

      if (current_slot_status !== "ABSENT") {
        throw new Api_error("Attendance already recorded. Ignored.", 409);
      }
    }

    // ---------- SLOT STATUS ----------
    let slot_status: "PRESENT" | "LATE" | "ABSENT" = !is_late
      ? "PRESENT"
      : LATE_PRESENT_ENABLED
      ? "LATE"
      : "ABSENT";

    let new_cumulative_count = device_user.cumulative_count;

    if (slot_status === "LATE") {
      new_cumulative_count += 1;

      if (new_cumulative_count > MAX_CUMULATIVE_COUNT) {
        slot_status = "ABSENT";
        new_cumulative_count = 0;
      }
    }

    // ---------- RAW (ONCE) ----------
    await tx.attendanceRaw.create({ data });

    let result;

    // ================= FIRST TIME =================
    if (!daily) {
      const morning_status = slot === "morning" ? slot_status : "ABSENT";
      const noon_status = slot === "noon" ? slot_status : "ABSENT";

      const final_status =
        morning_status === "ABSENT" || noon_status === "ABSENT"
          ? "ABSENT"
          : "PRESENT";

      result = await tx.attendanceDaily.create({
        data: {
          user_id: device_user.user_id,
          date: todayDate,
          morning_status,
          noon_status,
          final_status,
        },
      });
    }
    // ================= UPDATE =================
    else {
      const update_data: Partial<typeof daily> = {};

      if (slot === "morning") {
        update_data.morning_status = slot_status;
      } else {
        update_data.noon_status = slot_status;
      }

      const morning_status =
        slot === "morning" ? slot_status : daily.morning_status;

      const noon_status = slot === "noon" ? slot_status : daily.noon_status;

      update_data.final_status =
        morning_status === "ABSENT" || noon_status === "ABSENT"
          ? "ABSENT"
          : "PRESENT";

      result = await tx.attendanceDaily.update({
        where: { id: daily.id },
        data: update_data,
      });
    }

    // ---------- CUMULATIVE COUNT (ONCE) ----------
    if (new_cumulative_count !== device_user.cumulative_count) {
      await tx.biometricUser.update({
        where: { id: device_user.id },
        data: {
          cumulative_count: new_cumulative_count,
        },
      });
    }

    return result;
  });
};

const all_attendance_list = async (query: {
  role?: string;
  class_id?: string;
  section_id?: string;
  morning_status?: string;
  noon_status?: string;
  final_status?: string;
  name?: string;
  username?: string;
}) => {
  const {
    role,
    class_id,
    section_id,
    morning_status,
    noon_status,
    final_status,
    username,
    name,
  } = query;

  const user_where: any = {};

  if (role) user_where.role = role;
  if (username)
    user_where.username = { contains: username, mode: "insensitive" };

  // Name filter (role optional)
  if (name) {
    if (role === "STUDENT") {
      user_where.student_profile = {
        is: { name: { contains: name, mode: "insensitive" } },
      };
    } else if (role === "TEACHER") {
      user_where.teacher_profile = {
        is: { name: { contains: name, mode: "insensitive" } },
      };
    } else {
      // Role not specified: OR logic for both profiles
      user_where.OR = [
        {
          student_profile: {
            is: { name: { contains: name, mode: "insensitive" } },
          },
        },
        {
          teacher_profile: {
            is: { name: { contains: name, mode: "insensitive" } },
          },
        },
      ];
    }
  }

  // Student-specific filters
  if (role === "STUDENT" && (class_id || section_id)) {
    const student_where: any = {};
    if (class_id) student_where.class_id = class_id;
    if (section_id) student_where.section_id = section_id;

    if (Object.keys(student_where).length > 0) {
      if (!user_where.student_profile) user_where.student_profile = { is: {} };
      Object.assign(user_where.student_profile.is, student_where);
    }
  }

  const attendance_where: any = {};
  if (morning_status) attendance_where.morning_status = morning_status;
  if (noon_status) attendance_where.noon_status = noon_status;
  if (final_status) attendance_where.final_status = final_status;

  const all_attendance = await db.attendanceDaily.findMany({
    where: {
      ...attendance_where,
      user: user_where,
    },
    include: {
      user: {
        select: {
          id: true,
          role: true,
          username: true,
          student_profile: {
            select: { name: true, section_id: true, class_id: true },
          },
          teacher_profile: { select: { name: true } },
        },
      },
    },
  });
  return all_attendance;
};

const all_raw_attendance_list = async () => {
  const all_raw_attendance = await db.attendanceRaw.findMany();
  return all_raw_attendance;
};

const update_attendance = async (
  attendance_id: string,
  data: TUpdate_attendance_daily_schema
) => {
  const exist_attendance = await db.attendanceDaily.findUnique({
    where: { id: attendance_id },
  });
  if (!exist_attendance) {
    throw new Api_error("Requested attendance row does not exist", 404);
  }

  const updated_attendance = await db.attendanceDaily.update({
    where: { id: attendance_id },
    data: data,
  });
  return updated_attendance;
};

const delete_attendance = async (attendance_id: string) => {
  const exist_attendance = await db.attendanceDaily.findUnique({
    where: { id: attendance_id },
  });
  if (!exist_attendance) {
    throw new Api_error("Requested attendance row does not exist", 404);
  }

  const deleted_attendance = await db.attendanceDaily.delete({
    where: { id: attendance_id },
  });
  return deleted_attendance;
};

export const attendance_service = {
  create_attendance,
  all_attendance_list,
  all_raw_attendance_list,
  update_attendance,
  delete_attendance,
};
