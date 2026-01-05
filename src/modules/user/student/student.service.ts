import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import bcrypt from "bcryptjs";
import { TCreate_student_schema } from "./student.schema.js";

const create_student = async (data: TCreate_student_schema) => {
  const user = await db.user.findUnique({
    where: {
      username: data.user.username,
    },
  });
  if (user) {
    throw new Api_error("A user with this username already exists.", 409);
  }

  if (data.student_profile.roll_no) {
    const existing_roll = await db.student.findUnique({
      where: {
        roll_no: data.student_profile.roll_no,
        section_id: data.student_profile.section_id,
      },
    });

    if (existing_roll) throw new Api_error("Roll already in use", 409, "roll");
  }

  // const section = await db.section.findUnique({
  //   where: { id: data.student_profile.section_id },
  // });

  // if (!section)
  //   throw new Api_error(
  //     "Requested section does not exist",
  //     404,
  //     "section_id"
  //   );
  // if (section.class_id !== profile.class_id)
  //   throw new Api_error(
  //     "This section is not available for the selected class.",
  //     404,
  //     "section_id"
  //   );

  let new_guardian_ids: string[] = [];
  if (data.guardians && data.guardians.length > 0) {
    const existing_guardians = await Promise.all(
      data.guardians.map((guardian) =>
        db.guardian.findUnique({
          where: { phone: guardian.phone },
        })
      )
    );

    for (const guardian of existing_guardians) {
      if (guardian)
        throw new Api_error("Phone already in use", 409, "phone", guardian);
    }
  }

  const hashed_password = await bcrypt.hash(data.user.password, 10);

  // Create Student & Profile & Guardians
  const new_user = await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        username: data.user.username,
        role: "STUDENT",
        password: hashed_password,
      },
    });

    if (data.guardians && data.guardians.length > 0) {
      const new_guardians = await Promise.all(
        data.guardians.map((guardian) =>
          tx.guardian.create({
            data: guardian,
          })
        )
      );

      new_guardian_ids = new_guardians.map((guardian) => guardian.id);
    }

    const new_std = await tx.student.create({
      data: {
        ...data.student_profile,
        user_id: user.id,
        guardians: new_guardian_ids,
      },
    });

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      first_name: new_std.first_name,
    };
  });

  return new_user;
};

const update_student = async () => {};
// const update_student_by_admin = async (
//   user_id: string,
//   data: TUpdate_user_schema
// ) => {
//   const updated_info = await db.$transaction(async (tx) => {
//     const user = await tx.user.findUnique({ where: { id: user_id } });
//     if (!user) throw new Api_error("Requested user does not exist", 404);

//     const user_data: any = {};
//     if (data.username) user_data.username = data.username;
//     if (data.password) user_data.password = data.password;
//     if (data.role) user_data.role = data.role;

//     let updated_user = user;
//     if (Object.keys(user_data).length > 0) {
//       if (user_data.username) {
//         const existing_username = await tx.user.findUnique({
//           where: { username: user_data.username },
//         });

//         if (existing_username)
//           throw new Api_error("Username already in use", 409, "username");
//       }

//       updated_user = await tx.user.update({
//         where: {
//           id: user.id,
//         },
//         data: user_data,
//       });
//     }

//     if (data.role) {
//       const prev_role = user.role;
//       if (prev_role !== updated_user.role) {
//         const handler = create_profile_handlers[updated_user.role];
//         await handler(tx, updated_user, data);

//         switch (prev_role) {
//           // case "SUPER_ADMIN":
//           //   await tx.superAdmin.delete({ where: { user_id } });
//           //   break;
//           case "ADMIN":
//             await tx.admin.delete({ where: { user_id } });
//             break;
//           case "TEACHER":
//             await tx.teacher.delete({ where: { user_id } });
//             break;
//           case "STUDENT":
//             await tx.student.delete({ where: { user_id } });
//             break;
//           // case "PARENT":
//           //   await tx.parent.delete({ where: { user_id } });
//           //   break;
//           default:
//             break;
//         }

//         return {
//           id: updated_user.id,
//           username: updated_user.username,
//           role: updated_user.role,
//         };
//       }
//     }

//     const handler = update_profile_handlers[updated_user.role];
//     await handler(tx, updated_user, data);

//     return {
//       id: updated_user.id,
//       username: updated_user.username,
//       role: updated_user.role,
//     };
//   });

//   return updated_info;
// };

const delete_student = async (user_id: string) => {
  const user = await db.user.findUnique({
    where: {
      id: user_id,
    },
  });

  if (!user) {
    throw new Api_error("User not found", 404);
  }

  // if (user.role === "SUPER_ADMIN") {
  //   const users = await db.user.findMany({
  //     where: {
  //       role: "SUPER_ADMIN",
  //     },
  //   });

  //   if (users.length < 2) {
  //     throw new Api_error(
  //       "Operation not allowed: At least one SUPER ADMIN must remain",
  //       403
  //     );
  //   }
  // }

  const deleted_user = await db.user.delete({
    where: {
      id: user_id,
    },
  });

  return deleted_user;
};

const all_students_list = async () => {
  const students = await db.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, username: true, role: true },
  });

  return students;
};

const student_service = {
  create_student,
  update_student,
  all_students_list,
  // update_student_by_admin,
  delete_student,
};

export default student_service;
