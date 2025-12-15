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

    return await tx.superAdmin.create({
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

    return await tx.admin.create({
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
    return await tx.teacher.create({
      data: {
        ...profile,
        user_id: user.id,
      },
    });
  },
  STUDENT: async (tx, user, payload) => {
    const profile = payload.student_profile;

    const existing_roll = await tx.student.findUnique({
      where: { roll_no: profile.roll_no, section_id: profile.section_id },
    });

    if (existing_roll) throw new Api_error("Roll already in use", 409, "roll");

    const section = await tx.section.findUnique({
      where: { id: profile.section_id },
    });

    if (!section)
      throw new Api_error(
        "Requested section does not exist",
        404,
        "section_id"
      );
    if (section.class_id !== profile.class_id)
      throw new Api_error(
        "This section is not available for the selected class.",
        404,
        "section_id"
      );

    return await tx.student.create({
      data: {
        ...profile,
        user_id: user.id,
      },
    });
  },
  PARENT: async (tx, user, payload) => {
    return await tx.parent.create({
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
    if (profile && Object.keys(profile).length > 0) {
      if (profile.email) {
        const existing_email = await tx.superAdmin.findUnique({
          where: { email: profile.email },
        });
        if (existing_email)
          throw new Api_error("Email already in use", 409, "email");
      }

      return await tx.superAdmin.update({
        where: {
          user_id: user.id,
        },
        data: profile,
      });
    }
  },
  ADMIN: async (tx, user, payload) => {
    const profile = payload.admin_profile;

    if (profile && Object.keys(profile).length > 0) {
      if (profile.email) {
        const existing_email = await tx.admin.findUnique({
          where: { email: profile.email },
        });
        if (existing_email)
          throw new Api_error("Email already in use", 409, "email");
      }

      return await tx.admin.update({
        where: { user_id: user.id },
        data: profile,
      });
    }
  },
  TEACHER: async (tx, user, payload) => {
    const profile = payload.teacher_profile;
    if (profile && Object.keys(profile).length > 0) {
      if (profile.email) {
        const existing_email = await tx.teacher.findUnique({
          where: { email: profile.email },
        });
        if (existing_email)
          throw new Api_error("Email already in use", 409, "email");
      }
      return await tx.teacher.update({
        where: { user_id: user.id },
        data: profile,
      });
    }
  },
  STUDENT: async (tx, user, payload) => {
    const profile = payload.student_profile;

    if (profile && Object.keys(profile).length > 0) {
      const student_profile = await tx.student.findUnique({
        where: { user_id: user.id },
      });
      if (!student_profile) {
        throw new Api_error("Requested student does not exist", 404);
      }

      if (profile.roll_no) {
        const existing_roll = await tx.student.findUnique({
          where: { roll_no: profile.roll_no, section_id: profile.section_id },
        });

        if (existing_roll)
          throw new Api_error("Roll already in use", 409, "roll");
      }

      if (profile.section_id || profile.class_id) {
        const class_id = profile.class_id
          ? profile.class_id
          : student_profile.class_id;
        const section_id = profile.section_id
          ? profile.section_id
          : student_profile.section_id;

        const section = await tx.section.findUnique({
          where: { id: section_id },
        });

        if (!section)
          throw new Api_error(
            "Requested section does not exist",
            404,
            "section_id"
          );
        if (section.class_id !== class_id)
          throw new Api_error(
            "This section is not available for the selected class.",
            404,
            "section_id"
          );
      }

      return await tx.student.update({
        where: { user_id: user.id },
        data: profile,
      });
    }
  },
  PARENT: async (tx, user, payload) => {
    const profile = payload.parent_profile;
    if (profile && Object.keys(profile).length > 0) {
      return await tx.parent.update({
        where: { user_id: user.id },
        data: profile,
      });
    }
  },
};

export const USER_QUERY_BY_ROLE = {
  SUPER_ADMIN: {
    super_admin_profile: true,
  },
  ADMIN: {
    admin_profile: true,
  },

  STUDENT: {
    student_profile: {
      include: {
        results: true,
      },
    },
  },
  TEACHER: {
    teacher_profile: {
      include: {
        routine_entries: true,
        class_teacher_of: true,
      },
    },
  },
  PARENT: {
    parent_profile: {
      include: {
        students: true,
      },
    },
  },
} as const;
