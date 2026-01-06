import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import bcrypt from "bcryptjs";
import { TGuardian_login_schema, TLogin_schema } from "./auth.schema.js";

const login_user = async (data: TLogin_schema) => {
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

const login_guardian = async (data: TGuardian_login_schema) => {
  const guardian = await db.guardian.findUnique({
    where: {
      phone: data.phone,
    },
  });

  if (!guardian) {
    throw new Api_error("The requested guardian does not exist.", 404, "phone");
  }

  return guardian;
};

// const get_current_user = async (user_id: string, role: UserRole) => {
//   const user = await db.user.findUnique({
//     where: { id: user_id },
//     select: {
//       id: true,
//       username: true,
//       role: true,
//       ...USER_QUERY_BY_ROLE[role],
//     },
//   });

//   return user;
// };

const auth_service = {
  login_user,
  login_guardian,
  // get_current_user,
};

export default auth_service;
