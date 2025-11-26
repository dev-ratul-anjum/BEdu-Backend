import { db } from "$/db/index.ts";
import { TCreate_noticeboard_schema } from "./noticeboard.schema.ts";

const noticeboard_service = {
  create: async (data: TCreate_noticeboard_schema) => {
    try {
      const new_noticeboard = await db.noticeBoard.create({
        data: data,
      });
      return new_noticeboard;
    } catch (error) {
      throw error;
    }
  },

  delete: () => {},
};

export default noticeboard_service;
