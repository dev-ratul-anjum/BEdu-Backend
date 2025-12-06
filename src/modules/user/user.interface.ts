import { Prisma, User } from "$/db/generated/client.js";

export type ProfileHandlerFn = (
  tx: Prisma.TransactionClient,
  user: User,
  payload: Record<string, any>
) => Promise<any>;
