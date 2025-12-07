import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import { TCreate_notice_schema } from "./notice.schema.js";

const create_notice = async (data: TCreate_notice_schema) => {
  const new_noticeboard = await db.notice.create({
    data: data,
  });
  return new_noticeboard;
};

const all_notices_list = async () => {
  const all_notices = await db.notice.findMany({
    where: { is_published: true, is_archived: true },
  });
  return all_notices;
};

const archive_notice = async (notice_id: string) => {
  const notice = await db.notice.findUnique({
    where: { id: notice_id },
  });
  if (!notice) {
    throw new Api_error("Requested notice does not exist", 404);
  }

  const archive_notice = await db.notice.update({
    where: { id: notice_id },
    data: {
      is_archived: true,
    },
  });
  return archive_notice;
};

export const notice_service = {
  create_notice,
  all_notices_list,
  archive_notice,
};
