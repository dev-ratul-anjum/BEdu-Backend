import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import bcrypt from "bcryptjs";
import {
  profile_by_role,
  TCreate_user_schema,
  TLogin_user_schema,
  TUpdate_user_schema,
} from "./user.schema.js";
import { UserRole } from "$/db/generated/enums.js";
import { ProfileHandlerFn } from "./user.interface.js";
import {
  create_profile_handlers,
  update_profile_handlers,
  USER_QUERY_BY_ROLE,
} from "./user.utils.js";

const create_user = async (data: TCreate_user_schema) => {
  const user = await db.user.findUnique({
    where: {
      username: data.username,
    },
  });
  if (user) {
    throw new Api_error("A user with this username already exists.", 409);
  }
  const hashed_password = await bcrypt.hash(data.password, 10);

  // All Profile Handlers

  // Create User & Profile
  const new_user = await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        username: data.username,
        role: data.role,
        password: hashed_password,
      },
    });

    const handler = create_profile_handlers[data.role];
    await handler(tx, user, data);

    return { id: user.id, username: user.username, role: user.role };
  });

  return new_user;
};

const update_user = async () => {};
const update_user_by_admin = async (
  user_id: string,
  data: TUpdate_user_schema
) => {
  const updated_info = await db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: user_id } });
    if (!user) throw new Api_error("Requested user does not exist", 404);

    const user_data: any = {};
    if (data.username) user_data.username = data.username;
    if (data.password) user_data.password = data.password;
    if (data.role) user_data.role = data.role;

    let updated_user = user;
    if (Object.keys(user_data).length > 0) {
      if (user_data.username) {
        const existing_username = await tx.user.findUnique({
          where: { username: user_data.username },
        });

        if (existing_username)
          throw new Api_error("Username already in use", 409, "username");
      }

      updated_user = await tx.user.update({
        where: {
          id: user.id,
        },
        data: user_data,
      });
    }

    if (data.role) {
      const prev_role = user.role;
      if (prev_role !== updated_user.role) {
        const handler = create_profile_handlers[updated_user.role];
        await handler(tx, updated_user, data);

        switch (prev_role) {
          case "SUPER_ADMIN":
            await tx.superAdmin.delete({ where: { user_id } });
            break;
          case "ADMIN":
            await tx.admin.delete({ where: { user_id } });
            break;
          case "TEACHER":
            await tx.teacher.delete({ where: { user_id } });
            break;
          case "STUDENT":
            await tx.student.delete({ where: { user_id } });
            break;
          case "PARENT":
            await tx.parent.delete({ where: { user_id } });
            break;
          default:
            break;
        }

        return {
          id: updated_user.id,
          username: updated_user.username,
          role: updated_user.role,
        };
      }
    }

    const handler = update_profile_handlers[updated_user.role];
    await handler(tx, updated_user, data);

    return {
      id: updated_user.id,
      username: updated_user.username,
      role: updated_user.role,
    };
  });

  return updated_info;
};

const delete_user = async (user_id: string) => {
  const user = await db.user.findUnique({
    where: {
      id: user_id,
    },
  });

  if (!user) {
    throw new Api_error("User not found", 404);
  }

  if (user.role === "SUPER_ADMIN") {
    const users = await db.user.findMany({
      where: {
        role: "SUPER_ADMIN",
      },
    });

    if (users.length < 2) {
      throw new Api_error(
        "Operation not allowed: At least one SUPER ADMIN must remain",
        403
      );
    }
  }

  const deleted_user = await db.user.delete({
    where: {
      id: user_id,
    },
  });

  return deleted_user;
};

const login_user = async (data: TLogin_user_schema) => {
  const user = await db.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (!user) {
    throw new Api_error("The requested user does not exist.", 404, "username");
  }

  const is_password_valid = await bcrypt.compare(data.password, user.password);

  if (!is_password_valid) {
    throw new Api_error(
      "Incorrect password. Please try again.",
      401,
      "password"
    );
  }

  return user;
};

const all_students_list = async () => {
  const students = await db.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, username: true, role: true },
  });

  return students;
};
const all_teachers_list = async () => {
  const teachers = await db.user.findMany({
    where: { role: "TEACHER" },
    select: { id: true, username: true, role: true },
  });

  return teachers;
};
const all_parents_list = async () => {
  const parents = await db.user.findMany({
    where: { role: "PARENT" },
    select: { id: true, username: true, role: true },
  });

  return parents;
};
const all_admins_list = async () => {
  const admins = await db.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, username: true, role: true },
  });

  return admins;
};
const all_super_admins_list = async () => {
  const super_admins = await db.user.findMany({
    where: { role: "SUPER_ADMIN" },
    select: { id: true, username: true, role: true },
  });

  return super_admins;
};

const all_users_list = async (query: { role?: UserRole }) => {
  const { role } = query;

  if (!role) {
    throw new Api_error("Role is required to fetch users", 400);
  }
  const allowedRoles = ["STUDENT", "TEACHER", "ADMIN", "PARENT", "SUPER_ADMIN"];
  if (!allowedRoles.includes(role)) {
    throw new Api_error(
      `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}`,
      400
    );
  }
  const all_users = await db.user.findMany({
    where: { role },
    select: { id: true, username: true, role: true },
  });

  return all_users;
};

const get_current_user = async (user_id: string, role: UserRole) => {
  const user = await db.user.findUnique({
    where: { id: user_id },
    select: {
      id: true,
      username: true,
      role: true,
      ...USER_QUERY_BY_ROLE[role],
    },
  });

  return user;
};

const user_service = {
  create_user,
  login_user,
  update_user,
  all_users_list,
  all_students_list,
  all_teachers_list,
  all_parents_list,
  all_admins_list,
  all_super_admins_list,
  update_user_by_admin,
  delete_user,
  get_current_user,
};

export default user_service;
