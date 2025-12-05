import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error.js";
import bcrypt from "bcryptjs";
import { TCreate_user_schema, TLogin_user_schema } from "./user.schema.js";

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

  const new_user = await db.user.create({
    data: {
      ...data,
      password: hashed_password,
    },
    select: {
      id: true,
      username: true,
      role: true,
    },
  });

  return new_user;
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

const update_user = async () => {};
const update_user_role = async () => {};

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

const user_service = {
  create_user,
  login_user,
  update_user,
  update_user_role,
  delete_user,
};

export default user_service;
