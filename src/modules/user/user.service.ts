import { Role } from "$/db/generated/enums.ts";
import { db } from "$/db/index.ts";
import { Api_error } from "$/middleware/error.ts";
import bcrypt from "bcryptjs";
import { TCreate_user_schema, TLogin_user_schema } from "./user.schema.ts";

const user_service = {
  register: async (data: TCreate_user_schema) => {
    try {
      const user = await db.user.findUnique({
        where: {
          username: data.username,
        },
      });
      if (user) {
        throw new Api_error("User already exists", 409);
      }
      const hashed_password = await bcrypt.hash(data.password, 10);

      const role_profile_map: Record<Role, string> = {
        TEACHER: "teacher_profile",
        ADMIN: "admin_profile",
        ACCOUNTANT: "accountant_profile",
        STUDENT: "student_profile",
        PARENT: "parent_profile",
      };

      const build_profile_payload = (role: Role, data: any) => {
        const profile_key = role_profile_map[role];
        if (!profile_key) return {};

        return {
          [profile_key]: {
            create: data[profile_key],
          },
        };
      };

      const profile_payload = build_profile_payload(data.role, data);

      const new_user = await db.user.create({
        data: {
          username: data.username,
          password: hashed_password,
          role: data.role,
          ...profile_payload,
        },
      });

      return new_user;
    } catch (error) {
      throw error;
    }
  },

  login: async (data: TLogin_user_schema) => {
    try {
      const user = await db.user.findUnique({
        where: {
          username: data.username,
        },
      });

      if (!user) {
        throw new Api_error("User not found", 404);
      }

      const is_password_valid = await bcrypt.compare(
        data.password,
        user.password
      );

      if (!is_password_valid) {
        throw new Api_error("Invalid password", 401);
      }

      return { user };
    } catch (error) {
      throw error;
    }
  },

  get_list: () => {},

  delete: () => {},

  update: () => {},
};

export default user_service;
