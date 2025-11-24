import { db } from "$/db/index.ts";
import { validateData } from "$/lib/validateData.ts";
import apiResponse from "$/utils/apiResponse.ts";
import { RequestHandler } from "express";
import { userSchema } from "./user.schema.ts";

const userController = {
    createUser: async (req, res) => {

        const data = validateData( userSchema, req.body)


        const newUser = await db.user.create({
            data,
        })

        return apiResponse(res, 200, {
            success: true,
            message: 'User created successfully',
            data : newUser
        })
    },
    getUser: async (req, res) => {},
    updateUser: async (req, res) => {},
    deleteUser: async (req, res) => {},

} satisfies Record<string, RequestHandler>


export default userController;