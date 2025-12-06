import { UserRole } from "$/db/generated/enums.js";
import { Api_error } from "$/middleware/error_handler.js";
import { ProfileHandlerFn } from "./user.interface.js";

export const create_profile_handlers: Record<UserRole, ProfileHandlerFn> = {
  SUPER_ADMIN: async (tx, user, payload) => {
    const profile = payload.super_admin_profile;
    if (profile.email) {
      const existing_email = await tx.superAdmin.findUnique({
        where: { email: profile.email },
      });
      if (existing_email)
        throw new Api_error("Email already in use", 409, "email");
    }

    return tx.superAdmin.create({
      data: {
        ...profile,
        user_id: user.id,
      },
    });
  },
  ADMIN: async (tx, user, payload) => {
    const profile = payload.admin_profile;

    if (profile.email) {
      const existing_email = await tx.admin.findUnique({
        where: { email: profile.email },
      });
      if (existing_email)
        throw new Api_error("Email already in use", 409, "email");
    }

    return tx.admin.create({
      data: {
        ...profile,
        user_id: user.id,
      },
    });
  },
  TEACHER: async (tx, user, payload) => {
    const profile = payload.teacher_profile;
    if (profile.email) {
      const existing_email = await tx.teacher.findUnique({
        where: { email: profile.email },
      });
      if (existing_email)
        throw new Api_error("Email already in use", 409, "email");
    }
    return tx.teacher.create({
      data: {
        ...profile,
        user_id: user.id,
      },
    });
  },
  STUDENT: async (tx, user, payload) => {
    const profile = payload.student_profile;

    const existing_roll = await tx.student.findUnique({
      where: { roll_no: profile.roll_no },
    });

    if (existing_roll) throw new Api_error("Roll already in use", 409, "roll");

    return tx.student.create({
      data: {
        ...profile,
        user_id: user.id,
      },
    });
  },
  PARENT: async (tx, user, payload) => {
    return tx.parent.create({
      data: {
        ...payload.parent_profile,
        user_id: user.id,
      },
    });
  },
};

export const update_profile_handlers: Record<UserRole, ProfileHandlerFn> = {
  SUPER_ADMIN: async (tx, user, payload) => {
    const profile = payload.super_admin_profile;
    if (profile) {
      if (profile.email) {
        const existing_email = await tx.superAdmin.findUnique({
          where: { email: profile.email },
        });
        if (existing_email)
          throw new Api_error("Email already in use", 409, "email");
      }

      return tx.superAdmin.update({
        where: {
          user_id: user.id,
        },
        data: profile,
      });
    }
  },
  ADMIN: async (tx, user, payload) => {
    const profile = payload.admin_profile;

    if (profile) {
      if (profile.email) {
        const existing_email = await tx.admin.findUnique({
          where: { email: profile.email },
        });
        if (existing_email)
          throw new Api_error("Email already in use", 409, "email");
      }

      return tx.admin.update({
        where: { user_id: user.id },
        data: profile,
      });
    }
  },
  TEACHER: async (tx, user, payload) => {
    const profile = payload.teacher_profile;
    if (profile) {
      if (profile.email) {
        const existing_email = await tx.teacher.findUnique({
          where: { email: profile.email },
        });
        if (existing_email)
          throw new Api_error("Email already in use", 409, "email");
      }
      return tx.teacher.update({
        where: { user_id: user.id },
        data: profile,
      });
    }
  },
  STUDENT: async (tx, user, payload) => {
    const profile = payload.student_profile;

    if (profile) {
      const existing_roll = await tx.student.findUnique({
        where: { roll_no: profile.roll_no },
      });

      if (existing_roll)
        throw new Api_error("Roll already in use", 409, "roll");

      return tx.student.update({
        where: { user_id: user.id },
        data: profile,
      });
    }
  },
  PARENT: async (tx, user, payload) => {
    const profile = payload.parent_profile;
    if (profile) {
      return tx.parent.update({
        where: { user_id: user.id },
        data: profile,
      });
    }
  },
};
