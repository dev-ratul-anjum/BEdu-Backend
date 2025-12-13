import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import {
  TCreate_attendance_raw_schema,
  TUpdate_attendance_daily_schema,
} from "./attendance.schema.js";

const create_attendance = async (data: TCreate_attendance_raw_schema) => {
  // --- SLOT CONFIG ---
  const SLOT_CONFIG = {
    morning: { start: "07:30", end: "08:00", late_end: "08:15" },
    noon: { start: "11:30", end: "12:00", late_end: "12:15" },
  };
  const LATE_PRESENT_ENABLED = true;
  const MAX_CUMULATIVE_COUNT = 3;

  const punch_hm = data.timestamp.getHours() * 60 + data.timestamp.getMinutes();
  const to_minutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);

    return h * 60 + m;
  };

  let slot: "morning" | "noon" | null = null;
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

  const updated_daily_attendance = await db.$transaction(async (tx) => {
    const device_user = await db.biometricUser.findUnique({
      where: { id: data.device_user_id },
    });

    if (!device_user) {
      throw new Api_error("Requested biometric user does not exist", 404);
    }

    const todayDate = new Date(data.timestamp.toDateString());

    // Find or create daily attendance
    let daily = await tx.attendanceDaily.findUnique({
      where: {
        user_id_date: { user_id: device_user.user_id, date: todayDate },
      },
    });

    if (!daily) {
      daily = await tx.attendanceDaily.create({
        data: {
          user_id: device_user.user_id,
          date: todayDate,
          morning_status: "ABSENT",
          noon_status: "ABSENT",
          final_status: "ABSENT",
        },
      });
    }

    // Duplicate punch check (before raw create)
    const current_slot_status =
      slot === "morning" ? daily.morning_status : daily.noon_status;
    if (current_slot_status !== "ABSENT")
      throw new Api_error("Attendance already recorded. Ignored.", 200);

    // Create new raw attendance
    const new_raw_attendance = await tx.attendanceRaw.create({
      data,
    });

    // Calculate slot status
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

    // Update daily attendance
    const update_data: any = {};
    if (slot === "morning") update_data.morning_status = slot_status;
    else update_data.noon_status = slot_status;

    const morning_status =
      slot === "morning" ? slot_status : daily.morning_status;
    const noon_status = slot === "noon" ? slot_status : daily.noon_status;

    update_data.final_status =
      morning_status === "ABSENT" || noon_status === "ABSENT"
        ? "ABSENT"
        : "PRESENT";

    // Update cumulative count in biometricUser
    if (new_cumulative_count !== device_user.cumulative_count) {
      await tx.biometricUser.update({
        where: { id: device_user.id },
        data: { cumulative_count: new_cumulative_count },
      });
    }

    const updated_daily_attendance = await tx.attendanceDaily.update({
      where: { id: daily.id },
      data: update_data,
    });

    return updated_daily_attendance;
  });

  return updated_daily_attendance;
};

const all_attendance_list = async () => {
  const all_attendance = await db.attendanceDaily.findMany();
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
