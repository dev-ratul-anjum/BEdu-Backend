import { Role } from "$/db/generated/enums.ts";
import { z } from "zod";

export const userSchema = z.object({
    role : z.custom<Role>(),
    username : z.string(),
    password : z.string(),
    
})