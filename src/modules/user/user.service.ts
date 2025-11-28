import { db } from "$/db/index.ts";
import { ApiError } from "$/middleware/error.ts";
import bcrypt from "bcryptjs";
import { TCreateUserSchema, TLoginUserSchema } from "./user.schema.ts";

const userService = {
  register: async (data: TCreateUserSchema) => {
    try {
      const user = await db.user.findUnique({
        where: {
          username: data.username,
        },
      });
      if (user) {
        throw new ApiError("User already exists", 409);
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = await db.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          role: data.role,
          // nested create for relation
          ...(data.role === "TEACHER" && {
            teacherProfile: {
              create: { ...data.teacherProfile },
            },
          }),
          ...(data.role === "ADMIN" && {
            admin: {
              create: { ...data.admin },
            },
          }),
          ...(data.role === "ACCOUNTANT" && {
            accountant: {
              create: { ...data.accountant },
            },
          }),
          ...(data.role === "STUDENT" && {
            student: {
              create: { ...data.student },
            },
          }),
          ...(data.role === "PARENT" && {
            parent: {
              create: { ...data.parent },
            },
          }),
        },
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  },

  login: async (data: TLoginUserSchema) => {
    try {
      const user = await db.user.findUnique({
        where: {
          username: data.username,
        },
      });

      if (!user) {
        throw new ApiError("User not found", 404);
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new ApiError("Invalid password", 401);
      }

      return { user };
    } catch (error) {
      throw error;
    }
  },

  getList: () => {},

  delete: () => {},

  update: () => {},
};

export default userService;
