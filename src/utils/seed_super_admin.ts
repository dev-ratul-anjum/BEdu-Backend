import { db } from "$/db/index.js";
import bcrypt from "bcryptjs";

const seed_super_admin = async () => {
  const users = await db.user.findMany();

  if (users.length === 0) {
    const hashed_password = await bcrypt.hash("1234", 10);
    await db.user.create({
      data: {
        username: "1234",
        password: hashed_password,
        role: "SUPER_ADMIN",
      },
    });
    console.log("Super admin seeded");
  }
};
export default seed_super_admin;
