import { db } from "$/db/index.js";
import { TCreate_noticeboard_schema } from "./notice.schema.js";

const notice_service = {
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

export default notice_service;
